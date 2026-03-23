type IOptions = {
    page?: string | unknown;
    limit?: string | unknown;
    skip?: string | unknown;
    sortBy?: string | unknown;
    sortOrder?: string | unknown;
}

type IOptionsResult = {
    page: number;
    limit: number;
    skip: number;
    sortBy?: string;
    sortOrder?: string;
}

const paginationSortingHelper = (options: IOptions): IOptionsResult => {
    const page: number = Number(options.page) || 1;
    const limit: number = Number(options.limit) || 10;
    const skip = (page - 1) * limit;
    const sortBy: string = typeof options.sortBy === "string" ? options.sortBy : "createdAt";
    const sortOrder: string = typeof options.sortOrder === "string" ? options.sortOrder : "desc";

    return {
        page,
        limit,
        skip,
        sortBy,
        sortOrder
    }
}

export default paginationSortingHelper;