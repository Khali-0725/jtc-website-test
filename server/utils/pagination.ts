/* ============================================================
   pagination.ts — normalize page/pageSize and build list envelopes
   in the exact { items, total, page, pageSize } shape the frontend
   services (sermonService, eventService) expect.
   ============================================================ */

export interface ListResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface PageParams {
  page: number;
  pageSize: number;
  skip: number;
  take: number;
}

export function resolvePagination(
  page = 1,
  pageSize = 9,
  maxPageSize = 100,
): PageParams {
  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const safeSize =
    Number.isFinite(pageSize) && pageSize > 0
      ? Math.min(Math.floor(pageSize), maxPageSize)
      : 9;
  return {
    page: safePage,
    pageSize: safeSize,
    skip: (safePage - 1) * safeSize,
    take: safeSize,
  };
}

export function listResult<T>(
  items: T[],
  total: number,
  params: PageParams,
): ListResult<T> {
  return { items, total, page: params.page, pageSize: params.pageSize };
}
