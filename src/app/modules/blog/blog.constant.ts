export const blogPostSearchableFields = ["title", "excerpt", "content"] as const;

export const blogPostSortableFields = [
  "createdAt",
  "updatedAt",
  "publishedAt",
  "views",
  "title",
] as const;

export const blogCommentSortableFields = ["createdAt", "updatedAt"] as const;
