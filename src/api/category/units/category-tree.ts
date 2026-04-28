export interface PositionItem {
  is_header?: boolean;
  is_footer?: boolean;
  is_bottom?: boolean;
}

export interface CategoryNode {
  documentId: string;
  name: string;
  slug: string;
  active: boolean;
  parentDocumentId: string | null;
  positions: PositionItem[];
  parent?: {
    documentId: string;
    name: string;
    slug: string;
    active: boolean;
  } | null;
  children?: CategoryNode[];
}

export const normalizeCategory = (item: any): CategoryNode | null => {
  if (!item) return null;
  const parent = item.parent ?? item.category ?? null;

  return {
    documentId: item.documentId,
    name: item.name ?? "",
    slug: item.slug ?? "",
    active: item.active === true,
    parentDocumentId: parent?.documentId ?? null,
    positions: Array.isArray(item.positions) ? item.positions : [],
    parent: parent
      ? {
        documentId: parent.documentId,
        name: parent.name ?? "",
        slug: parent.slug ?? "",
        active: parent.active === true,
      }
      : null,
  };
};

const groupByParent = (
  categories: CategoryNode[]
): Map<string | null, CategoryNode[]> => {
  const grouped = new Map<string | null, CategoryNode[]>();

  for (const category of categories) {
    const key = category.parentDocumentId ?? null;

    if (!grouped.has(key)) {
      grouped.set(key, []);
    }

    grouped.get(key)!.push(category);
  }

  return grouped;
};

const buildMenuRecursive = (
  parentDocumentId: string | null,
  grouped: Map<string | null, CategoryNode[]>
): CategoryNode[] => {
  const children = grouped.get(parentDocumentId) || [];

  return children.map((item) => ({
    ...item,
    children: buildMenuRecursive(item.documentId, grouped),
  }));
};

export const makeCategoryMenu = (categories: any[]): CategoryNode[] => {
  const normalized = categories
    .map(normalizeCategory)
    .filter((item): item is CategoryNode => item !== null && item.active);

  const grouped = groupByParent(normalized);

  return buildMenuRecursive(null, grouped);
};

const makeCategoryMap = (categories: CategoryNode[]): Map<string, CategoryNode> => {
  const map = new Map<string, CategoryNode>();

  for (const category of categories) {
    map.set(category.documentId, category);
  }

  return map;
};

const buildBreadcrumbRecursive = (
  documentId: string,
  categoryMap: Map<string, CategoryNode>,
  trail: Array<{ documentId: string; name: string; slug: string }> = []
): Array<{ documentId: string; name: string; slug: string }> => {
  const current = categoryMap.get(documentId);

  if (!current) {
    return trail;
  }

  const nextTrail = [
    {
      documentId: current.documentId,
      name: current.name,
      slug: current.slug,
    },
    ...trail,
  ];

  if (!current.parentDocumentId) {
    return nextTrail;
  }

  return buildBreadcrumbRecursive(current.parentDocumentId, categoryMap, nextTrail);
};

export const makeBreadcrumbByDocumentId = (
  documentId: string,
  categories: any[]
): Array<{ documentId: string; name: string; slug: string }> => {
  const normalized = categories
    .map(normalizeCategory)
    .filter((item): item is CategoryNode => item !== null && item.active);

  const categoryMap = makeCategoryMap(normalized);

  return buildBreadcrumbRecursive(documentId, categoryMap);
};

export const makeBreadcrumbBySlug = (
  slug: string,
  categories: any[]
): Array<{ documentId: string; name: string; slug: string }> => {
  const normalized = categories
    .map(normalizeCategory)
    .filter((item): item is CategoryNode => item !== null && item.active);

  const current = normalized.find((item) => item.slug === slug);

  if (!current) {
    return [];
  }

  const categoryMap = makeCategoryMap(normalized);

  return buildBreadcrumbRecursive(current.documentId, categoryMap);
};
