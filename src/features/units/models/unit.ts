export type Unit = {
    _id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
};

export type ApiListResponse<T> = {
    success: boolean;
    data: T[];
};

export type ApiItemResponse<T> = {
    success: boolean;
    data: T;
    message?: string;
};
