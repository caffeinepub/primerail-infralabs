import Time "mo:core/Time";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Map "mo:core/Map";
import Order "mo:core/Order";

actor {
  type Submission = {
    name : Text;
    phone : Text;
    email : Text;
    message : Text;
    timestamp : Time.Time;
    id : Nat;
  };

  module Submission {
    public func compare(a : Submission, b : Submission) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  var nextId = 0;
  let submissions = List.empty<Submission>();

  let emailToRefs = Map.empty<Text, List.List<Nat>>();
  let phoneToRefs = Map.empty<Text, List.List<Nat>>();

  public shared ({ caller }) func submitContactForm(
    name : Text,
    phone : Text,
    email : Text,
    message : Text,
  ) : async () {
    let submission : Submission = {
      name;
      phone;
      email;
      message;
      timestamp = Time.now();
      id = nextId;
    };

    submissions.add(submission);

    switch (emailToRefs.get(email)) {
      case (null) {
        emailToRefs.add(email, List.fromArray<Nat>([nextId]));
      };
      case (?refs) {
        refs.add(nextId);
      };
    };

    switch (phoneToRefs.get(phone)) {
      case (null) {
        phoneToRefs.add(phone, List.fromArray<Nat>([nextId]));
      };
      case (?refs) {
        refs.add(nextId);
      };
    };

    nextId += 1;
  };

  public query ({ caller }) func getAllSubmissions() : async [Submission] {
    submissions.toArray();
  };

  public query ({ caller }) func getAllSubmissionsSortedByTimestamp() : async [Submission] {
    submissions.toArray().sort(
      func(a, b) { Nat.compare(a.id, b.id) }
    );
  };

  public query ({ caller }) func getSubmissionsByEmail(email : Text) : async [Submission] {
    switch (emailToRefs.get(email)) {
      case (null) { [] };
      case (?refs) {
        let refArray = refs.toArray();
        let filteredSubmissions = submissions.toArray().filter(
          func(submission) {
            refArray.any(func(id) { id == submission.id });
          }
        );
        filteredSubmissions;
      };
    };
  };

  public query ({ caller }) func getSubmissionsByPhone(phone : Text) : async [Submission] {
    switch (phoneToRefs.get(phone)) {
      case (null) { [] };
      case (?refs) {
        let refArray = refs.toArray();
        let filteredSubmissions = submissions.toArray().filter(
          func(submission) {
            refArray.any(func(id) { id == submission.id });
          }
        );
        filteredSubmissions;
      };
    };
  };
};
