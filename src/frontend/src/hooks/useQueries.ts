import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  ContentCategory,
  ContentItem,
  backendInterface as FullBackendInterface,
  Option,
} from "../backend.d";
import { useActor } from "./useActor";

function fullActor(
  actor: ReturnType<typeof useActor>["actor"],
): FullBackendInterface | null {
  return actor as unknown as FullBackendInterface | null;
}

export function useSubmitContactForm() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      name,
      phone,
      email,
      message,
    }: {
      name: string;
      phone: string;
      email: string;
      message: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitContactForm(name, phone, email, message);
    },
  });
}

// ─── Content Hub (Public) ────────────────────────────────────────────────────

export function usePublishedContent() {
  const { actor, isFetching } = useActor();
  return useQuery<ContentItem[]>({
    queryKey: ["publishedContent"],
    queryFn: async () => {
      const fa = fullActor(actor);
      if (!fa) return [];
      return fa.getAllPublishedContent();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 10_000,
  });
}

// ─── Admin Content ───────────────────────────────────────────────────────────

export function useAllContentAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<ContentItem[]>({
    queryKey: ["allContentAdmin"],
    queryFn: async () => {
      const fa = fullActor(actor);
      if (!fa) return [];
      return fa.getAllContentAdmin();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 10_000,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isCallerAdmin"],
    queryFn: async () => {
      const fa = fullActor(actor);
      if (!fa) return false;
      return fa.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateContent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      title,
      body,
      category,
      imageUrl,
      author,
    }: {
      title: string;
      body: string;
      category: ContentCategory;
      imageUrl: Option<string>;
      author: string;
    }) => {
      const fa = fullActor(actor);
      if (!fa) throw new Error("Not connected");
      return fa.createContent(title, body, category, imageUrl, author);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allContentAdmin"] });
      queryClient.invalidateQueries({ queryKey: ["publishedContent"] });
    },
  });
}

export function useUpdateContent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      title,
      body,
      category,
      imageUrl,
      author,
      published,
    }: {
      id: bigint;
      title: string;
      body: string;
      category: ContentCategory;
      imageUrl: Option<string>;
      author: string;
      published: boolean;
    }) => {
      const fa = fullActor(actor);
      if (!fa) throw new Error("Not connected");
      return fa.updateContent(
        id,
        title,
        body,
        category,
        imageUrl,
        author,
        published,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allContentAdmin"] });
      queryClient.invalidateQueries({ queryKey: ["publishedContent"] });
    },
  });
}

export function useDeleteContent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      const fa = fullActor(actor);
      if (!fa) throw new Error("Not connected");
      return fa.deleteContent(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allContentAdmin"] });
      queryClient.invalidateQueries({ queryKey: ["publishedContent"] });
    },
  });
}
