import httpStatus from "http-status-codes";
import type { Prisma } from "../../../../generated/prisma/client";
import AppError from "../../helper/AppError";
import { prisma } from "../../lib/prisma";
import { Role } from "../user/user.interface";
import {
  blogCommentSortableFields,
  blogPostSearchableFields,
  blogPostSortableFields,
} from "./blog.constant";
import type {
  IBlogCommentQuery,
  IBlogPostQuery,
  ICreateBlogCategoryPayload,
  ICreateBlogCommentPayload,
  ICreateBlogPostPayload,
  ICreateBlogTagPayload,
  IModerateBlogCommentPayload,
  IUpdateBlogCategoryPayload,
  IUpdateBlogPostPayload,
  IUpdateBlogTagPayload,
} from "./blog.interface";

const blogCategorySelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  createdAt: true,
  updatedAt: true,
  _count: {
    select: {
      posts: true,
    },
  },
} satisfies Prisma.BlogCategorySelect;

const blogTagSelect = {
  id: true,
  name: true,
  slug: true,
  createdAt: true,
  updatedAt: true,
  _count: {
    select: {
      posts: true,
    },
  },
} satisfies Prisma.BlogTagSelect;

const blogPublicPostSelect = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  content: true,
  featuredImage: true,
  authorId: true,
  publishedAt: true,
  isPublished: true,
  views: true,
  allowComments: true,
  createdAt: true,
  updatedAt: true,
  categories: {
    select: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
        },
      },
    },
  },
  tags: {
    select: {
      tag: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  },
} satisfies Prisma.BlogPostSelect;

const blogAdminPostSelect = {
  ...blogPublicPostSelect,
  metaTitle: true,
  metaDescription: true,
  metaKeywords: true,
  metadata: true,
} satisfies Prisma.BlogPostSelect;

const blogPublicCommentReplySelect = {
  id: true,
  postId: true,
  userId: true,
  authorName: true,
  content: true,
  isApproved: true,
  parentId: true,
  createdAt: true,
  updatedAt: true,
  user: {
    select: {
      id: true,
      name: true,
      image: true,
    },
  },
} satisfies Prisma.BlogCommentSelect;

const blogPublicCommentSelect = {
  ...blogPublicCommentReplySelect,
  replies: {
    where: {
      isApproved: true,
    },
    orderBy: [{ createdAt: "asc" }],
    select: blogPublicCommentReplySelect,
  },
} satisfies Prisma.BlogCommentSelect;

const blogAdminCommentSelect = {
  id: true,
  postId: true,
  userId: true,
  authorName: true,
  authorEmail: true,
  content: true,
  isApproved: true,
  parentId: true,
  createdAt: true,
  updatedAt: true,
  post: {
    select: {
      id: true,
      title: true,
      slug: true,
      isPublished: true,
    },
  },
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
  },
  parent: {
    select: {
      id: true,
      content: true,
      userId: true,
      authorName: true,
    },
  },
} satisfies Prisma.BlogCommentSelect;

type TBlogAuthor = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: Role;
};

type TBlogPublicPost = Prisma.BlogPostGetPayload<{ select: typeof blogPublicPostSelect }>;
type TBlogAdminPost = Prisma.BlogPostGetPayload<{ select: typeof blogAdminPostSelect }>;

const getPagination = (query: { page?: string; limit?: string }) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 20, 1), 100);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

const parseBooleanQuery = (value: string, key: string) => {
  const normalized = value.trim().toLowerCase();

  if (normalized === "true") {
    return true;
  }

  if (normalized === "false") {
    return false;
  }

  throw new AppError(httpStatus.BAD_REQUEST, `${key} must be true or false`);
};

const buildPostOrderBy = (
  sort: string | undefined,
  isPublic: boolean,
): Prisma.BlogPostOrderByWithRelationInput[] => {
  if (!sort?.trim()) {
    return isPublic
      ? [{ publishedAt: "desc" }, { createdAt: "desc" }]
      : [{ createdAt: "desc" }];
  }

  const orderBy = sort
    .split(",")
    .map((field) => field.trim())
    .filter(Boolean)
    .map((field) => {
      const direction = field.startsWith("-") ? "desc" : "asc";
      const normalizedField = field.replace(/^-/, "");

      if (
        !blogPostSortableFields.includes(
          normalizedField as (typeof blogPostSortableFields)[number],
        )
      ) {
        return null;
      }

      return {
        [normalizedField]: direction,
      } as Prisma.BlogPostOrderByWithRelationInput;
    })
    .filter(
      (value): value is Prisma.BlogPostOrderByWithRelationInput => value !== null,
    );

  if (!orderBy.length) {
    return isPublic
      ? [{ publishedAt: "desc" }, { createdAt: "desc" }]
      : [{ createdAt: "desc" }];
  }

  return orderBy;
};

const buildCommentOrderBy = (
  sort: string | undefined,
): Prisma.BlogCommentOrderByWithRelationInput[] => {
  if (!sort?.trim()) {
    return [{ createdAt: "desc" }];
  }

  const orderBy = sort
    .split(",")
    .map((field) => field.trim())
    .filter(Boolean)
    .map((field) => {
      const direction = field.startsWith("-") ? "desc" : "asc";
      const normalizedField = field.replace(/^-/, "");

      if (
        !blogCommentSortableFields.includes(
          normalizedField as (typeof blogCommentSortableFields)[number],
        )
      ) {
        return null;
      }

      return {
        [normalizedField]: direction,
      } as Prisma.BlogCommentOrderByWithRelationInput;
    })
    .filter(
      (value): value is Prisma.BlogCommentOrderByWithRelationInput => value !== null,
    );

  if (!orderBy.length) {
    return [{ createdAt: "desc" }];
  }

  return orderBy;
};

const buildPublicPostWhere = (query: IBlogPostQuery): Prisma.BlogPostWhereInput => {
  const andConditions: Prisma.BlogPostWhereInput[] = [
    {
      isPublished: true,
    },
    {
      OR: [{ publishedAt: null }, { publishedAt: { lte: new Date() } }],
    },
  ];

  if (query.searchTerm?.trim()) {
    andConditions.push({
      OR: blogPostSearchableFields.map((field) => ({
        [field]: {
          contains: query.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (query.categoryId?.trim()) {
    andConditions.push({
      categories: {
        some: {
          categoryId: query.categoryId.trim(),
        },
      },
    });
  }

  if (query.categorySlug?.trim()) {
    andConditions.push({
      categories: {
        some: {
          category: {
            slug: query.categorySlug.trim(),
          },
        },
      },
    });
  }

  if (query.tagId?.trim()) {
    andConditions.push({
      tags: {
        some: {
          tagId: query.tagId.trim(),
        },
      },
    });
  }

  if (query.tagSlug?.trim()) {
    andConditions.push({
      tags: {
        some: {
          tag: {
            slug: query.tagSlug.trim(),
          },
        },
      },
    });
  }

  return {
    AND: andConditions,
  };
};

const buildAdminPostWhere = (query: IBlogPostQuery): Prisma.BlogPostWhereInput => {
  const andConditions: Prisma.BlogPostWhereInput[] = [];

  if (query.searchTerm?.trim()) {
    andConditions.push({
      OR: blogPostSearchableFields.map((field) => ({
        [field]: {
          contains: query.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (query.isPublished !== undefined) {
    andConditions.push({
      isPublished: parseBooleanQuery(query.isPublished, "isPublished"),
    });
  }

  if (query.authorId?.trim()) {
    andConditions.push({
      authorId: query.authorId.trim(),
    });
  }

  if (query.categoryId?.trim()) {
    andConditions.push({
      categories: {
        some: {
          categoryId: query.categoryId.trim(),
        },
      },
    });
  }

  if (query.categorySlug?.trim()) {
    andConditions.push({
      categories: {
        some: {
          category: {
            slug: query.categorySlug.trim(),
          },
        },
      },
    });
  }

  if (query.tagId?.trim()) {
    andConditions.push({
      tags: {
        some: {
          tagId: query.tagId.trim(),
        },
      },
    });
  }

  if (query.tagSlug?.trim()) {
    andConditions.push({
      tags: {
        some: {
          tag: {
            slug: query.tagSlug.trim(),
          },
        },
      },
    });
  }

  if (!andConditions.length) {
    return {};
  }

  return {
    AND: andConditions,
  };
};

const ensurePostSlugUnique = async (slug: string, excludedPostId?: string) => {
  const existing = await prisma.blogPost.findFirst({
    where: {
      slug,
      ...(excludedPostId && { id: { not: excludedPostId } }),
    },
    select: { id: true },
  });

  if (existing) {
    throw new AppError(httpStatus.CONFLICT, "Blog post slug already exists");
  }
};

const ensureCategorySlugUnique = async (
  slug: string,
  excludedCategoryId?: string,
) => {
  const existing = await prisma.blogCategory.findFirst({
    where: {
      slug,
      ...(excludedCategoryId && { id: { not: excludedCategoryId } }),
    },
    select: { id: true },
  });

  if (existing) {
    throw new AppError(httpStatus.CONFLICT, "Blog category slug already exists");
  }
};

const ensureTagSlugUnique = async (slug: string, excludedTagId?: string) => {
  const existing = await prisma.blogTag.findFirst({
    where: {
      slug,
      ...(excludedTagId && { id: { not: excludedTagId } }),
    },
    select: { id: true },
  });

  if (existing) {
    throw new AppError(httpStatus.CONFLICT, "Blog tag slug already exists");
  }
};

const validateCategoryIds = async (categoryIds?: string[]) => {
  if (!categoryIds?.length) {
    return [] as string[];
  }

  const uniqueCategoryIds = [...new Set(categoryIds)];

  const foundCategories = await prisma.blogCategory.findMany({
    where: {
      id: {
        in: uniqueCategoryIds,
      },
    },
    select: {
      id: true,
    },
  });

  if (foundCategories.length !== uniqueCategoryIds.length) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Some category ids are invalid for this blog post",
    );
  }

  return uniqueCategoryIds;
};

const validateTagIds = async (tagIds?: string[]) => {
  if (!tagIds?.length) {
    return [] as string[];
  }

  const uniqueTagIds = [...new Set(tagIds)];

  const foundTags = await prisma.blogTag.findMany({
    where: {
      id: {
        in: uniqueTagIds,
      },
    },
    select: {
      id: true,
    },
  });

  if (foundTags.length !== uniqueTagIds.length) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Some tag ids are invalid for this blog post",
    );
  }

  return uniqueTagIds;
};

const attachAuthorsToPosts = async <T extends { authorId: string | null }>(
  posts: T[],
) => {
  const authorIds = [
    ...new Set(
      posts
        .map((post) => post.authorId)
        .filter((authorId): authorId is string => Boolean(authorId)),
    ),
  ];

  const authors = authorIds.length
    ? await prisma.user.findMany({
        where: {
          id: {
            in: authorIds,
          },
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
        },
      })
    : [];

  const authorMap = new Map<string, TBlogAuthor>(
    authors.map((author) => [
      author.id,
      {
        id: author.id,
        name: author.name,
        email: author.email,
        image: author.image,
        role: author.role as Role,
      },
    ]),
  );

  return posts.map((post) => ({
    ...post,
    author: post.authorId ? (authorMap.get(post.authorId) ?? null) : null,
  }));
};

const attachAuthorToSinglePost = async <T extends { authorId: string | null }>(
  post: T,
) => {
  const [enrichedPost] = await attachAuthorsToPosts([post]);

  return enrichedPost;
};

const createPost = async (authorId: string, payload: ICreateBlogPostPayload) => {
  await ensurePostSlugUnique(payload.slug);

  const [categoryIds, tagIds] = await Promise.all([
    validateCategoryIds(payload.categoryIds),
    validateTagIds(payload.tagIds),
  ]);

  const post = await prisma.$transaction(async (tx) => {
    const data: Prisma.BlogPostUncheckedCreateInput = {
      title: payload.title,
      slug: payload.slug,
      content: payload.content,
      authorId,
      isPublished: payload.isPublished ?? false,
      allowComments: payload.allowComments ?? true,
    };

    if (payload.excerpt !== undefined) {
      data.excerpt = payload.excerpt;
    }

    if (payload.featuredImage !== undefined) {
      data.featuredImage = payload.featuredImage;
    }

    if (payload.metaTitle !== undefined) {
      data.metaTitle = payload.metaTitle;
    }

    if (payload.metaDescription !== undefined) {
      data.metaDescription = payload.metaDescription;
    }

    if (payload.metaKeywords !== undefined) {
      data.metaKeywords = payload.metaKeywords;
    }

    if (payload.metadata !== undefined) {
      data.metadata = payload.metadata;
    }

    if (payload.isPublished) {
      data.publishedAt = payload.publishedAt ?? new Date();
    } else if (payload.publishedAt !== undefined) {
      data.publishedAt = payload.publishedAt;
    }

    const createdPost = await tx.blogPost.create({
      data,
      select: {
        id: true,
      },
    });

    if (categoryIds.length) {
      await tx.blogPostCategory.createMany({
        data: categoryIds.map((categoryId) => ({
          postId: createdPost.id,
          categoryId,
        })),
      });
    }

    if (tagIds.length) {
      await tx.blogPostTag.createMany({
        data: tagIds.map((tagId) => ({
          postId: createdPost.id,
          tagId,
        })),
      });
    }

    const fullPost = await tx.blogPost.findUnique({
      where: {
        id: createdPost.id,
      },
      select: blogAdminPostSelect,
    });

    if (!fullPost) {
      throw new AppError(httpStatus.NOT_FOUND, "Blog post not found");
    }

    return fullPost;
  });

  return attachAuthorToSinglePost(post);
};

const updatePost = async (
  postId: string,
  payload: IUpdateBlogPostPayload,
) => {
  const existingPost = await prisma.blogPost.findUnique({
    where: { id: postId },
    select: {
      id: true,
      slug: true,
      isPublished: true,
    },
  });

  if (!existingPost) {
    throw new AppError(httpStatus.NOT_FOUND, "Blog post not found");
  }

  if (Object.keys(payload).length === 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "At least one field is required to update blog post",
    );
  }

  if (payload.slug !== undefined && payload.slug !== existingPost.slug) {
    await ensurePostSlugUnique(payload.slug, postId);
  }

  const [categoryIds, tagIds] = await Promise.all([
    payload.categoryIds !== undefined
      ? validateCategoryIds(payload.categoryIds)
      : Promise.resolve(undefined),
    payload.tagIds !== undefined
      ? validateTagIds(payload.tagIds)
      : Promise.resolve(undefined),
  ]);

  const updatedPost = await prisma.$transaction(async (tx) => {
    const updateData: Prisma.BlogPostUncheckedUpdateInput = {};

    if (payload.title !== undefined) {
      updateData.title = payload.title;
    }

    if (payload.slug !== undefined) {
      updateData.slug = payload.slug;
    }

    if (payload.excerpt !== undefined) {
      updateData.excerpt = payload.excerpt;
    }

    if (payload.content !== undefined) {
      updateData.content = payload.content;
    }

    if (payload.featuredImage !== undefined) {
      updateData.featuredImage = payload.featuredImage;
    }

    if (payload.allowComments !== undefined) {
      updateData.allowComments = payload.allowComments;
    }

    if (payload.metaTitle !== undefined) {
      updateData.metaTitle = payload.metaTitle;
    }

    if (payload.metaDescription !== undefined) {
      updateData.metaDescription = payload.metaDescription;
    }

    if (payload.metaKeywords !== undefined) {
      updateData.metaKeywords = payload.metaKeywords;
    }

    if (payload.metadata !== undefined) {
      updateData.metadata = payload.metadata;
    }

    if (payload.isPublished !== undefined) {
      updateData.isPublished = payload.isPublished;

      if (payload.isPublished) {
        if (payload.publishedAt !== undefined) {
          updateData.publishedAt = payload.publishedAt;
        } else if (!existingPost.isPublished) {
          updateData.publishedAt = new Date();
        }
      } else {
        updateData.publishedAt = null;
      }
    } else if (payload.publishedAt !== undefined) {
      updateData.publishedAt = payload.publishedAt;
    }

    if (Object.keys(updateData).length > 0) {
      await tx.blogPost.update({
        where: {
          id: postId,
        },
        data: updateData,
      });
    }

    if (categoryIds !== undefined) {
      await tx.blogPostCategory.deleteMany({
        where: {
          postId,
        },
      });

      if (categoryIds.length) {
        await tx.blogPostCategory.createMany({
          data: categoryIds.map((categoryId) => ({
            postId,
            categoryId,
          })),
        });
      }
    }

    if (tagIds !== undefined) {
      await tx.blogPostTag.deleteMany({
        where: {
          postId,
        },
      });

      if (tagIds.length) {
        await tx.blogPostTag.createMany({
          data: tagIds.map((tagId) => ({
            postId,
            tagId,
          })),
        });
      }
    }

    const fullPost = await tx.blogPost.findUnique({
      where: {
        id: postId,
      },
      select: blogAdminPostSelect,
    });

    if (!fullPost) {
      throw new AppError(httpStatus.NOT_FOUND, "Blog post not found");
    }

    return fullPost;
  });

  return attachAuthorToSinglePost(updatedPost);
};

const deletePostByAdmin = async (postId: string) => {
  const existingPost = await prisma.blogPost.findUnique({
    where: { id: postId },
    select: { id: true },
  });

  if (!existingPost) {
    throw new AppError(httpStatus.NOT_FOUND, "Blog post not found");
  }

  await prisma.blogPost.delete({
    where: { id: postId },
  });
};

const getPublicPosts = async (query: IBlogPostQuery) => {
  const { page, limit, skip } = getPagination(query);
  const where = buildPublicPostWhere(query);

  const [data, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      orderBy: buildPostOrderBy(query.sort, true),
      skip,
      take: limit,
      select: blogPublicPostSelect,
    }),
    prisma.blogPost.count({ where }),
  ]);

  const enrichedData = await attachAuthorsToPosts(data);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
    data: enrichedData,
  };
};

const getPublicPostBySlug = async (slug: string) => {
  const post = await prisma.$transaction(async (tx) => {
    const existingPost = await tx.blogPost.findFirst({
      where: {
        slug,
        isPublished: true,
        OR: [{ publishedAt: null }, { publishedAt: { lte: new Date() } }],
      },
      select: blogPublicPostSelect,
    });

    if (!existingPost) {
      throw new AppError(httpStatus.NOT_FOUND, "Blog post not found");
    }

    const updatedPost = await tx.blogPost.update({
      where: {
        id: existingPost.id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
      select: blogPublicPostSelect,
    });

    return updatedPost;
  });

  return attachAuthorToSinglePost(post);
};

const getAllPostsForAdmin = async (query: IBlogPostQuery) => {
  const { page, limit, skip } = getPagination(query);
  const where = buildAdminPostWhere(query);

  const [data, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      orderBy: buildPostOrderBy(query.sort, false),
      skip,
      take: limit,
      select: blogAdminPostSelect,
    }),
    prisma.blogPost.count({ where }),
  ]);

  const enrichedData = await attachAuthorsToPosts(data);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
    data: enrichedData,
  };
};

const getPostByIdForAdmin = async (postId: string) => {
  const post = await prisma.blogPost.findUnique({
    where: {
      id: postId,
    },
    select: blogAdminPostSelect,
  });

  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, "Blog post not found");
  }

  return attachAuthorToSinglePost(post);
};

const getCategories = async (query: { page?: string; limit?: string; searchTerm?: string }) => {
  const { page, limit, skip } = getPagination(query);
  const where: Prisma.BlogCategoryWhereInput = {};

  if (query.searchTerm?.trim()) {
    where.OR = [
      {
        name: {
          contains: query.searchTerm,
          mode: "insensitive",
        },
      },
      {
        slug: {
          contains: query.searchTerm,
          mode: "insensitive",
        },
      },
    ];
  }

  const [data, total] = await Promise.all([
    prisma.blogCategory.findMany({
      where,
      orderBy: [{ name: "asc" }],
      skip,
      take: limit,
      select: blogCategorySelect,
    }),
    prisma.blogCategory.count({ where }),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
    data,
  };
};

const createCategory = async (payload: ICreateBlogCategoryPayload) => {
  await ensureCategorySlugUnique(payload.slug);

  const createdCategory = await prisma.blogCategory.create({
    data: {
      name: payload.name,
      slug: payload.slug,
      ...(payload.description !== undefined && { description: payload.description }),
    },
    select: blogCategorySelect,
  });

  return createdCategory;
};

const updateCategory = async (
  categoryId: string,
  payload: IUpdateBlogCategoryPayload,
) => {
  const existingCategory = await prisma.blogCategory.findUnique({
    where: { id: categoryId },
    select: {
      id: true,
      slug: true,
    },
  });

  if (!existingCategory) {
    throw new AppError(httpStatus.NOT_FOUND, "Blog category not found");
  }

  if (payload.slug !== undefined && payload.slug !== existingCategory.slug) {
    await ensureCategorySlugUnique(payload.slug, categoryId);
  }

  const updatedCategory = await prisma.blogCategory.update({
    where: { id: categoryId },
    data: {
      ...(payload.name !== undefined && { name: payload.name }),
      ...(payload.slug !== undefined && { slug: payload.slug }),
      ...(payload.description !== undefined && { description: payload.description }),
    },
    select: blogCategorySelect,
  });

  return updatedCategory;
};

const deleteCategoryByAdmin = async (categoryId: string) => {
  const existingCategory = await prisma.blogCategory.findUnique({
    where: { id: categoryId },
    select: { id: true },
  });

  if (!existingCategory) {
    throw new AppError(httpStatus.NOT_FOUND, "Blog category not found");
  }

  await prisma.blogCategory.delete({
    where: {
      id: categoryId,
    },
  });
};

const getTags = async (query: { page?: string; limit?: string; searchTerm?: string }) => {
  const { page, limit, skip } = getPagination(query);
  const where: Prisma.BlogTagWhereInput = {};

  if (query.searchTerm?.trim()) {
    where.OR = [
      {
        name: {
          contains: query.searchTerm,
          mode: "insensitive",
        },
      },
      {
        slug: {
          contains: query.searchTerm,
          mode: "insensitive",
        },
      },
    ];
  }

  const [data, total] = await Promise.all([
    prisma.blogTag.findMany({
      where,
      orderBy: [{ name: "asc" }],
      skip,
      take: limit,
      select: blogTagSelect,
    }),
    prisma.blogTag.count({ where }),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
    data,
  };
};

const createTag = async (payload: ICreateBlogTagPayload) => {
  await ensureTagSlugUnique(payload.slug);

  const createdTag = await prisma.blogTag.create({
    data: {
      name: payload.name,
      slug: payload.slug,
    },
    select: blogTagSelect,
  });

  return createdTag;
};

const updateTag = async (tagId: string, payload: IUpdateBlogTagPayload) => {
  const existingTag = await prisma.blogTag.findUnique({
    where: { id: tagId },
    select: {
      id: true,
      slug: true,
    },
  });

  if (!existingTag) {
    throw new AppError(httpStatus.NOT_FOUND, "Blog tag not found");
  }

  if (payload.slug !== undefined && payload.slug !== existingTag.slug) {
    await ensureTagSlugUnique(payload.slug, tagId);
  }

  const updatedTag = await prisma.blogTag.update({
    where: { id: tagId },
    data: {
      ...(payload.name !== undefined && { name: payload.name }),
      ...(payload.slug !== undefined && { slug: payload.slug }),
    },
    select: blogTagSelect,
  });

  return updatedTag;
};

const deleteTagByAdmin = async (tagId: string) => {
  const existingTag = await prisma.blogTag.findUnique({
    where: { id: tagId },
    select: { id: true },
  });

  if (!existingTag) {
    throw new AppError(httpStatus.NOT_FOUND, "Blog tag not found");
  }

  await prisma.blogTag.delete({
    where: { id: tagId },
  });
};

const createComment = async (
  postId: string,
  payload: ICreateBlogCommentPayload,
  user: {
    id: string;
    role: Role;
    name: string | null;
    email: string;
  },
) => {
  const post = await prisma.blogPost.findUnique({
    where: { id: postId },
    select: {
      id: true,
      isPublished: true,
      allowComments: true,
    },
  });

  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, "Blog post not found");
  }

  if (!post.isPublished) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Cannot comment on an unpublished blog post",
    );
  }

  if (!post.allowComments) {
    throw new AppError(httpStatus.BAD_REQUEST, "Comments are disabled for this post");
  }

  if (payload.parentId) {
    const parentComment = await prisma.blogComment.findFirst({
      where: {
        id: payload.parentId,
        postId,
      },
      select: {
        id: true,
      },
    });

    if (!parentComment) {
      throw new AppError(httpStatus.BAD_REQUEST, "Parent comment is invalid");
    }
  }

  const autoApproved = user.role === Role.ADMIN || user.role === Role.MANAGER;

  const commentData: Prisma.BlogCommentUncheckedCreateInput = {
    postId,
    userId: user.id,
    content: payload.content,
    isApproved: autoApproved,
  };

  if (payload.parentId !== undefined) {
    commentData.parentId = payload.parentId;
  }

  if (user.name) {
    commentData.authorName = user.name;
  }

  if (user.email) {
    commentData.authorEmail = user.email;
  }

  const createdComment = await prisma.blogComment.create({
    data: commentData,
    select: blogAdminCommentSelect,
  });

  return createdComment;
};

const getPublicCommentsByPostSlug = async (
  slug: string,
  query: IBlogCommentQuery,
) => {
  const post = await prisma.blogPost.findFirst({
    where: {
      slug,
      isPublished: true,
      OR: [{ publishedAt: null }, { publishedAt: { lte: new Date() } }],
    },
    select: {
      id: true,
      title: true,
      slug: true,
      allowComments: true,
    },
  });

  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, "Blog post not found");
  }

  const { page, limit, skip } = getPagination(query);

  const where: Prisma.BlogCommentWhereInput = {
    postId: post.id,
    parentId: null,
    isApproved: true,
  };

  if (query.searchTerm?.trim()) {
    where.content = {
      contains: query.searchTerm,
      mode: "insensitive",
    };
  }

  const [data, total] = await Promise.all([
    prisma.blogComment.findMany({
      where,
      orderBy: buildCommentOrderBy(query.sort),
      skip,
      take: limit,
      select: blogPublicCommentSelect,
    }),
    prisma.blogComment.count({ where }),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
    post,
    data,
  };
};

const getAllCommentsForAdmin = async (query: IBlogCommentQuery) => {
  const { page, limit, skip } = getPagination(query);
  const where: Prisma.BlogCommentWhereInput = {};

  if (query.postId?.trim()) {
    where.postId = query.postId.trim();
  }

  if (query.userId?.trim()) {
    where.userId = query.userId.trim();
  }

  if (query.isApproved !== undefined) {
    where.isApproved = parseBooleanQuery(query.isApproved, "isApproved");
  }

  if (query.searchTerm?.trim()) {
    where.OR = [
      {
        content: {
          contains: query.searchTerm,
          mode: "insensitive",
        },
      },
      {
        authorName: {
          contains: query.searchTerm,
          mode: "insensitive",
        },
      },
      {
        authorEmail: {
          contains: query.searchTerm,
          mode: "insensitive",
        },
      },
    ];
  }

  const [data, total] = await Promise.all([
    prisma.blogComment.findMany({
      where,
      orderBy: buildCommentOrderBy(query.sort),
      skip,
      take: limit,
      select: blogAdminCommentSelect,
    }),
    prisma.blogComment.count({ where }),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
    data,
  };
};

const moderateComment = async (
  commentId: string,
  payload: IModerateBlogCommentPayload,
) => {
  const existingComment = await prisma.blogComment.findUnique({
    where: { id: commentId },
    select: { id: true },
  });

  if (!existingComment) {
    throw new AppError(httpStatus.NOT_FOUND, "Blog comment not found");
  }

  const updatedComment = await prisma.blogComment.update({
    where: {
      id: commentId,
    },
    data: {
      isApproved: payload.isApproved,
    },
    select: blogAdminCommentSelect,
  });

  return updatedComment;
};

const deleteCommentByAdmin = async (commentId: string) => {
  const existingComment = await prisma.blogComment.findUnique({
    where: { id: commentId },
    select: { id: true },
  });

  if (!existingComment) {
    throw new AppError(httpStatus.NOT_FOUND, "Blog comment not found");
  }

  await prisma.blogComment.delete({
    where: {
      id: commentId,
    },
  });
};

export const BlogService = {
  createPost,
  updatePost,
  deletePostByAdmin,
  getPublicPosts,
  getPublicPostBySlug,
  getAllPostsForAdmin,
  getPostByIdForAdmin,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategoryByAdmin,
  getTags,
  createTag,
  updateTag,
  deleteTagByAdmin,
  createComment,
  getPublicCommentsByPostSlug,
  getAllCommentsForAdmin,
  moderateComment,
  deleteCommentByAdmin,
};
