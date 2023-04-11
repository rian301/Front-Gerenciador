export class PaginationResponseDto<T> {
    totalItems: number;
    content: T[];
}