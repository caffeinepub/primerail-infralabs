import Time "mo:core/Time";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Map "mo:core/Map";
import Order "mo:core/Order";
import AccessControl "authorization/access-control";
import Storage "blob-storage/Storage";
import Prim "mo:prim";
import Runtime "mo:core/Runtime";

persistent actor {
  // ===== Migration: preserve stable vars from previous version =====
  // These were declared in the old actor and must be explicitly migrated.
  // We keep them here so the upgrade compatibility check passes.
  var nextId : Nat = 0;
  let emailToRefs = Map.empty<Text, List.List<Nat>>();
  let phoneToRefs = Map.empty<Text, List.List<Nat>>();

  // ===== Authorization =====
  let _accessControlState = AccessControl.initState();

  public shared ({ caller }) func _initializeAccessControlWithSecret(userSecret : Text) : async () {
    switch (Prim.envVar<system>("CAFFEINE_ADMIN_TOKEN")) {
      case (null) { Runtime.trap("CAFFEINE_ADMIN_TOKEN not set") };
      case (?adminToken) { AccessControl.initialize(_accessControlState, caller, adminToken, userSecret) };
    };
  };

  public query ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(_accessControlState, caller);
  };

  public shared ({ caller }) func assignCallerUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    AccessControl.assignRole(_accessControlState, caller, user, role);
  };

  public query ({ caller }) func isCallerAdmin() : async Bool {
    AccessControl.isAdmin(_accessControlState, caller);
  };

  // ===== Blob Storage =====
  transient let _caffeineStorageState : Storage.State = Storage.new();

  type ExternalBlob = Storage.ExternalBlob;

  type _CaffeineStorageRefillInformation = { proposed_top_up_amount : ?Nat };
  type _CaffeineStorageRefillResult = { success : ?Bool; topped_up_amount : ?Nat };
  type _CaffeineStorageCreateCertificateResult = { method : Text; blob_hash : Text };

  public shared ({ caller }) func _caffeineStorageRefillCashier(info : ?_CaffeineStorageRefillInformation) : async _CaffeineStorageRefillResult {
    let cashier = await Storage.getCashierPrincipal();
    if (cashier != caller) { Runtime.trap("Unauthorized") };
    await Storage.refillCashier(_caffeineStorageState, cashier, info);
  };

  public shared ({ caller }) func _caffeineStorageUpdateGatewayPrincipals() : async () {
    await Storage.updateGatewayPrincipals(_caffeineStorageState);
  };

  public query ({ caller }) func _caffeineStorageBlobIsLive(hash : Blob) : async Bool {
    Prim.isStorageBlobLive(hash);
  };

  public query ({ caller }) func _caffeineStorageBlobsToDelete() : async [Blob] {
    if (not Storage.isAuthorized(_caffeineStorageState, caller)) { Runtime.trap("Unauthorized") };
    let dead = Prim.getDeadBlobs();
    switch (dead) { case (null) { [] }; case (?d) { d.sliceToArray(0, 10000) } };
  };

  public shared ({ caller }) func _caffeineStorageConfirmBlobDeletion(blobs : [Blob]) : async () {
    if (not Storage.isAuthorized(_caffeineStorageState, caller)) { Runtime.trap("Unauthorized") };
    Prim.pruneConfirmedDeadBlobs(blobs);
    type GC = actor { __motoko_gc_trigger : () -> async () };
    let myGC = actor (debug_show (Prim.getSelfPrincipal<system>())) : GC;
    await myGC.__motoko_gc_trigger();
  };

  public shared ({ caller }) func _caffeineStorageCreateCertificate(blobHash : Text) : async _CaffeineStorageCreateCertificateResult {
    { method = "upload"; blob_hash = blobHash };
  };

  // ===== Contact Form =====
  type Submission = {
    name : Text;
    phone : Text;
    email : Text;
    message : Text;
    timestamp : Time.Time;
    id : Nat;
  };

  var nextSubmissionId : Nat = 0;
  let submissions = List.empty<Submission>();

  public shared ({ caller }) func submitContactForm(name : Text, phone : Text, email : Text, message : Text) : async () {
    let s : Submission = { name; phone; email; message; timestamp = Time.now(); id = nextSubmissionId };
    submissions.add(s);
    nextSubmissionId += 1;
  };

  public query ({ caller }) func getAllSubmissions() : async [Submission] {
    submissions.toArray();
  };

  public query ({ caller }) func getAllSubmissionsSortedByTimestamp() : async [Submission] {
    submissions.toArray().sort(func(a, b) { Nat.compare(a.id, b.id) });
  };

  // ===== Content Management =====
  type ContentCategory = { #Post; #Blog; #News; #Article };

  type ContentItem = {
    id : Nat;
    title : Text;
    body : Text;
    category : ContentCategory;
    imageUrl : ?Text;
    author : Text;
    createdAt : Time.Time;
    published : Bool;
  };

  var nextContentId : Nat = 0;
  let contentItems = List.empty<ContentItem>();

  public shared ({ caller }) func createContent(
    title : Text,
    body : Text,
    category : ContentCategory,
    imageUrl : ?Text,
    author : Text,
  ) : async Nat {
    if (not AccessControl.isAdmin(_accessControlState, caller)) {
      Runtime.trap("Admin access required");
    };
    let item : ContentItem = {
      id = nextContentId;
      title;
      body;
      category;
      imageUrl;
      author;
      createdAt = Time.now();
      published = true;
    };
    contentItems.add(item);
    let id = nextContentId;
    nextContentId += 1;
    id;
  };

  public shared ({ caller }) func updateContent(
    id : Nat,
    title : Text,
    body : Text,
    category : ContentCategory,
    imageUrl : ?Text,
    author : Text,
    published : Bool,
  ) : async Bool {
    if (not AccessControl.isAdmin(_accessControlState, caller)) {
      Runtime.trap("Admin access required");
    };
    let arr = contentItems.toArray();
    var found = false;
    for (i in arr.keys()) {
      if (arr[i].id == id) { found := true };
    };
    if (not found) return false;
    let updated = arr.map(func(item : ContentItem) : ContentItem {
      if (item.id == id) {
        { id; title; body; category; imageUrl; author; createdAt = item.createdAt; published }
      } else { item }
    });
    contentItems.clear();
    for (item in updated.vals()) { contentItems.add(item) };
    true;
  };

  public shared ({ caller }) func deleteContent(id : Nat) : async Bool {
    if (not AccessControl.isAdmin(_accessControlState, caller)) {
      Runtime.trap("Admin access required");
    };
    let before = contentItems.size();
    let filtered = contentItems.toArray().filter(func(item : ContentItem) : Bool { item.id != id });
    contentItems.clear();
    for (item in filtered.vals()) { contentItems.add(item) };
    contentItems.size() < before;
  };

  public query ({ caller }) func getAllPublishedContent() : async [ContentItem] {
    contentItems.toArray()
      .filter(func(item : ContentItem) : Bool { item.published })
      .sort(func(a : ContentItem, b : ContentItem) : Order.Order {
        if (a.createdAt > b.createdAt) #less
        else if (a.createdAt < b.createdAt) #greater
        else #equal
      });
  };

  public query ({ caller }) func getPublishedContentByCategory(category : ContentCategory) : async [ContentItem] {
    contentItems.toArray()
      .filter(func(item : ContentItem) : Bool {
        item.published and (switch (item.category, category) {
          case (#Post, #Post) true;
          case (#Blog, #Blog) true;
          case (#News, #News) true;
          case (#Article, #Article) true;
          case _ false;
        })
      })
      .sort(func(a : ContentItem, b : ContentItem) : Order.Order {
        if (a.createdAt > b.createdAt) #less
        else if (a.createdAt < b.createdAt) #greater
        else #equal
      });
  };

  public query ({ caller }) func getAllContentAdmin() : async [ContentItem] {
    contentItems.toArray()
      .sort(func(a : ContentItem, b : ContentItem) : Order.Order {
        if (a.createdAt > b.createdAt) #less
        else if (a.createdAt < b.createdAt) #greater
        else #equal
      });
  };
};
