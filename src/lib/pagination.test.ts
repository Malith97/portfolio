import { getPaginationState, paginateItems } from "@/lib/pagination";

describe("pagination utilities", () => {
  it("returns all items when the collection fits on one page", () => {
    const items = Array.from({ length: 9 }, (_, index) => index + 1);

    expect(paginateItems(items, 1, 9)).toEqual(items);
    expect(getPaginationState(items.length, 1, 9).pageCount).toBe(1);
  });

  it("returns the requested page slice when pagination is needed", () => {
    const items = Array.from({ length: 12 }, (_, index) => index + 1);

    expect(paginateItems(items, 1, 9)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(paginateItems(items, 2, 9)).toEqual([10, 11, 12]);
  });

  it("normalizes out-of-range page numbers", () => {
    expect(getPaginationState(12, 0, 9).currentPage).toBe(1);
    expect(getPaginationState(12, 8, 9).currentPage).toBe(2);
  });
});
