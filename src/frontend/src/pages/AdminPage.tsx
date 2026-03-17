import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import {
  useAllContentAdmin,
  useCreateContent,
  useDeleteContent,
  useIsCallerAdmin,
  useUpdateContent,
} from "@/hooks/useQueries";
import { HttpAgent } from "@icp-sdk/core/agent";
import {
  AlertTriangle,
  Edit2,
  FileText,
  Image,
  Loader2,
  LogOut,
  Plus,
  Trash2,
  Upload,
  Users,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { ContentCategory, ContentItem } from "../backend.d";
import { loadConfig } from "../config";
import { StorageClient } from "../utils/StorageClient";

// ─── Types ───────────────────────────────────────────────────────────────

type CategoryKey = "Post" | "Blog" | "News" | "Article";

const CATEGORIES: CategoryKey[] = ["Post", "Blog", "News", "Article"];

function makeCategoryObj(key: CategoryKey): ContentCategory {
  return { __kind__: key } as ContentCategory;
}

function formatDate(ns: bigint): string {
  const ms = Number(ns / BigInt(1_000_000));
  return new Date(ms).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ─── Image Uploader ────────────────────────────────────────────────────────

function useImageUpload() {
  const { identity } = useInternetIdentity();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const upload = async (file: File): Promise<string | null> => {
    setUploading(true);
    setProgress(0);
    try {
      const config = await loadConfig();
      const agent = new HttpAgent({
        host: config.backend_host,
        identity: identity ?? undefined,
      });
      if (config.backend_host?.includes("localhost")) {
        await agent.fetchRootKey().catch(() => {});
      }
      const storageClient = new StorageClient(
        config.bucket_name,
        config.storage_gateway_url,
        config.backend_canister_id,
        config.project_id,
        agent,
      );
      const bytes = new Uint8Array(await file.arrayBuffer());
      const { hash } = await storageClient.putFile(bytes, (pct) =>
        setProgress(pct),
      );
      const url = await storageClient.getDirectURL(hash);
      return url;
    } catch (err) {
      console.error("Upload failed", err);
      toast.error("Image upload failed");
      return null;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return { upload, uploading, progress };
}

// ─── Form State ──────────────────────────────────────────────────────────────

type FormState = {
  title: string;
  body: string;
  category: CategoryKey;
  author: string;
  imageUrl: string;
  published: boolean;
};

const EMPTY_FORM: FormState = {
  title: "",
  body: "",
  category: "Post",
  author: "",
  imageUrl: "",
  published: true,
};

function formToApi(f: FormState) {
  return {
    title: f.title.trim(),
    body: f.body.trim(),
    category: makeCategoryObj(f.category),
    imageUrl: f.imageUrl.trim()
      ? ({ __kind__: "Some", value: f.imageUrl.trim() } as const)
      : ({ __kind__: "None" } as const),
    author: f.author.trim(),
    published: f.published,
  };
}

// ─── Content Form Dialog ──────────────────────────────────────────────────

function ContentFormDialog({
  open,
  onClose,
  editing,
}: {
  open: boolean;
  onClose: () => void;
  editing: ContentItem | null;
}) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const fileRef = useRef<HTMLInputElement>(null);
  const { upload, uploading, progress } = useImageUpload();
  const createContent = useCreateContent();
  const updateContent = useUpdateContent();

  const isPending = createContent.isPending || updateContent.isPending;

  useEffect(() => {
    if (editing) {
      setForm({
        title: editing.title,
        body: editing.body,
        category: (editing.category.__kind__ as CategoryKey) ?? "Post",
        author: editing.author,
        imageUrl:
          editing.imageUrl.__kind__ === "Some" ? editing.imageUrl.value : "",
        published: editing.published,
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [editing]);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await upload(file);
    if (url) setForm((p) => ({ ...p, imageUrl: url }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.body.trim() || !form.author.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    const apiData = formToApi(form);
    try {
      if (editing) {
        await updateContent.mutateAsync({ id: editing.id, ...apiData });
        toast.success("Content updated successfully");
      } else {
        await createContent.mutateAsync(apiData);
        toast.success("Content published successfully");
      }
      onClose();
    } catch (err: any) {
      toast.error(err?.message || "Failed to save content");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
        data-ocid="admin.content.dialog"
      >
        <DialogHeader>
          <DialogTitle className="text-navy font-display">
            {editing ? "Edit Content" : "Create New Content"}
          </DialogTitle>
          <DialogDescription>
            {editing
              ? "Update the content details below."
              : "Fill in the details to publish new content."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) =>
                  setForm((p) => ({ ...p, title: e.target.value }))
                }
                placeholder="Enter title"
                data-ocid="admin.content.input"
              />
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                value={form.category}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, category: v as CategoryKey }))
                }
              >
                <SelectTrigger data-ocid="admin.content.select">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="author">Author *</Label>
              <Input
                id="author"
                value={form.author}
                onChange={(e) =>
                  setForm((p) => ({ ...p, author: e.target.value }))
                }
                placeholder="Author name"
                data-ocid="admin.author.input"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="body">Content *</Label>
            <Textarea
              id="body"
              value={form.body}
              onChange={(e) => setForm((p) => ({ ...p, body: e.target.value }))}
              placeholder="Write your content here..."
              rows={8}
              data-ocid="admin.content.textarea"
            />
          </div>

          <div>
            <Label>Image</Label>
            <div className="flex items-center gap-3 mt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                data-ocid="admin.image.upload_button"
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {progress}%
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Image
                  </>
                )}
              </Button>
              {form.imageUrl && (
                <div className="flex items-center gap-2">
                  <img
                    src={form.imageUrl}
                    alt="preview"
                    className="h-10 w-10 rounded object-cover border border-border"
                  />
                  <button
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, imageUrl: "" }))}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageSelect}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="published"
              checked={form.published}
              onChange={(e) =>
                setForm((p) => ({ ...p, published: e.target.checked }))
              }
              className="h-4 w-4 accent-orange-500"
              data-ocid="admin.published.checkbox"
            />
            <Label htmlFor="published" className="cursor-pointer">
              Published (visible on website)
            </Label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              data-ocid="admin.content.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || uploading}
              className="bg-navy hover:bg-navy/90 text-white"
              data-ocid="admin.content.submit_button"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : editing ? (
                "Update Content"
              ) : (
                "Publish Content"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Delete Confirmation ─────────────────────────────────────────────────

function DeleteConfirmDialog({
  open,
  item,
  onClose,
  onConfirm,
  isDeleting,
}: {
  open: boolean;
  item: ContentItem | null;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent data-ocid="admin.delete.dialog">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle size={18} />
            Delete Content
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <strong>&ldquo;{item?.title}&rdquo;</strong>? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            data-ocid="admin.delete.cancel_button"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
            data-ocid="admin.delete.confirm_button"
          >
            {isDeleting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 h-4 w-4" />
            )}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Content Table ────────────────────────────────────────────────────────────

function ContentTable() {
  const { data: items = [], isLoading } = useAllContentAdmin();
  const deleteContent = useDeleteContent();
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ContentItem | null>(null);

  const handleEdit = (item: ContentItem) => {
    setEditingItem(item);
    setFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteContent.mutateAsync(deleteTarget.id);
      toast.success("Content deleted");
      setDeleteTarget(null);
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete");
    }
  };

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center py-16 text-muted-foreground"
        data-ocid="admin.content.loading_state"
      >
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Loading content...
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display font-bold text-navy">
          All Content
        </h2>
        <Button
          onClick={() => {
            setEditingItem(null);
            setFormOpen(true);
          }}
          className="bg-navy hover:bg-navy/90 text-white"
          data-ocid="admin.content.open_modal_button"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Content
        </Button>
      </div>

      {items.length === 0 ? (
        <div
          className="text-center py-20 text-muted-foreground"
          data-ocid="admin.content.empty_state"
        >
          <FileText className="mx-auto h-12 w-12 mb-4 opacity-30" />
          <p className="text-lg font-medium">No content yet</p>
          <p className="text-sm mt-1">
            Create your first post, article, or news item.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm" data-ocid="admin.content.table">
            <thead>
              <tr className="bg-muted/50 text-left">
                <th className="px-4 py-3 font-semibold text-navy/70">Title</th>
                <th className="px-4 py-3 font-semibold text-navy/70">
                  Category
                </th>
                <th className="px-4 py-3 font-semibold text-navy/70">Author</th>
                <th className="px-4 py-3 font-semibold text-navy/70">Date</th>
                <th className="px-4 py-3 font-semibold text-navy/70">Status</th>
                <th className="px-4 py-3 font-semibold text-navy/70">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr
                  key={item.id.toString()}
                  className="border-t border-border hover:bg-muted/30 transition-colors"
                  data-ocid={`admin.content.row.${idx + 1}`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {item.imageUrl.__kind__ === "Some" && (
                        <img
                          src={item.imageUrl.value}
                          alt=""
                          className="h-8 w-8 rounded object-cover border border-border flex-shrink-0"
                        />
                      )}
                      <span className="font-medium text-navy line-clamp-1">
                        {item.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="text-xs">
                      {item.category.__kind__}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-navy/70">{item.author}</td>
                  <td className="px-4 py-3 text-navy/60 whitespace-nowrap">
                    {formatDate(item.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        item.published
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          item.published ? "bg-green-500" : "bg-amber-500"
                        }`}
                      />
                      {item.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(item)}
                        data-ocid={`admin.content.edit_button.${idx + 1}`}
                      >
                        <Edit2 size={15} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteTarget(item)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        data-ocid={`admin.content.delete_button.${idx + 1}`}
                      >
                        <Trash2 size={15} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ContentFormDialog
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingItem(null);
        }}
        editing={editingItem}
      />

      <DeleteConfirmDialog
        open={!!deleteTarget}
        item={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isDeleting={deleteContent.isPending}
      />
    </>
  );
}

// ─── Stats Cards ─────────────────────────────────────────────────────────────

function AdminStats({ items }: { items: ContentItem[] }) {
  const total = items.length;
  const published = items.filter((i) => i.published).length;
  const drafts = total - published;

  const stats = [
    {
      label: "Total Content",
      value: total,
      icon: FileText,
      color: "text-blue-600 bg-blue-100",
    },
    {
      label: "Published",
      value: published,
      icon: Users,
      color: "text-green-600 bg-green-100",
    },
    {
      label: "Drafts",
      value: drafts,
      icon: Image,
      color: "text-amber-600 bg-amber-100",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      {stats.map((s) => (
        <Card key={s.label} className="border-border">
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-lg ${s.color}`}>
                <s.icon size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-navy">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ─── Login Screen ───────────────────────────────────────────────────────────

function AdminLogin() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy to-[oklch(0.12_0.05_255)] flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 h-16 w-16 rounded-2xl bg-muted flex items-center justify-center">
            <img
              src="/assets/uploads/image-1.png"
              alt="PrimeRail"
              className="h-12 w-auto object-contain"
            />
          </div>
          <CardTitle className="text-2xl font-display text-navy">
            Admin Panel
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Sign in to access the PrimeRail admin dashboard.
          </p>
        </CardHeader>
        <CardContent className="pt-4">
          <Button
            onClick={login}
            disabled={isLoggingIn}
            className="w-full bg-navy hover:bg-navy/90 text-white py-6 text-base font-semibold rounded-xl"
            data-ocid="admin.login.primary_button"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Connecting...
              </>
            ) : (
              "Sign In with Internet Identity"
            )}
          </Button>
          <p className="text-center text-xs text-muted-foreground mt-4">
            Only authorized administrators can access this panel.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Not Admin Screen ──────────────────────────────────────────────────────

function NotAdminScreen({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-navy to-[oklch(0.12_0.05_255)] flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl text-center">
        <CardContent className="pt-8 pb-8">
          <AlertTriangle className="mx-auto h-12 w-12 text-amber-500 mb-4" />
          <h2 className="text-xl font-bold text-navy mb-2">Access Denied</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Your account does not have admin privileges.
          </p>
          <Button
            variant="outline"
            onClick={onLogout}
            data-ocid="admin.logout.button"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Admin Dashboard ────────────────────────────────────────────────────────

function AdminDashboard() {
  const { clear, identity } = useInternetIdentity();
  const { data: items = [] } = useAllContentAdmin();

  return (
    <div className="min-h-screen bg-[#f4f6f9] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-navy text-white flex-shrink-0 flex flex-col">
        <div className="px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <img
              src="/assets/uploads/image-1.png"
              alt="PrimeRail"
              className="h-10 w-auto object-contain"
            />
            <div>
              <p className="font-bold text-white text-sm leading-tight">
                PrimeRail
              </p>
              <p className="text-white/50 text-xs">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6">
          <p className="text-white/40 uppercase text-xs tracking-wider mb-3 px-2">
            Management
          </p>
          <a
            href="#content"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/10 text-white text-sm font-medium mb-1"
            data-ocid="admin.nav.content.link"
          >
            <FileText size={16} />
            Content
          </a>
        </nav>

        <div className="px-4 py-4 border-t border-white/10">
          <div className="text-white/50 text-xs mb-3 px-2 truncate">
            {identity?.getPrincipal().toString().slice(0, 24)}...
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clear}
            className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10"
            data-ocid="admin.logout.button"
          >
            <LogOut size={16} className="mr-2" />
            Sign Out
          </Button>
          <a
            href="/"
            className="mt-2 flex items-center gap-2 px-3 py-2 text-white/50 hover:text-white text-xs rounded-lg hover:bg-white/10 transition-colors"
            data-ocid="admin.back.link"
          >
            &larr; Back to Website
          </a>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-border px-8 py-4 sticky top-0 z-10">
          <h1 className="text-2xl font-display font-bold text-navy">
            Content Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage posts, articles, news, and blogs for the PrimeRail website.
          </p>
        </header>

        <div className="px-8 py-8">
          <AdminStats items={items} />
          <Card className="border-border shadow-sm">
            <CardContent className="pt-6">
              <ContentTable />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

// ─── Admin Page (Root) ───────────────────────────────────────────────────────

export default function AdminPage() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: isAdmin, isLoading: checkingAdmin } = useIsCallerAdmin();
  const { clear } = useInternetIdentity();

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  if (!identity) {
    return <AdminLogin />;
  }

  if (checkingAdmin) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  if (isAdmin === false) {
    return <NotAdminScreen onLogout={clear} />;
  }

  return <AdminDashboard />;
}
