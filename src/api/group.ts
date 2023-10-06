import { PaginationConfig } from "antd/es/pagination"
import { axiosInstance } from "./request"


export const getGroupList = async (pagination?: PaginationConfig | null, searchText?: string) => {
    try {
        const data: any = await axiosInstance.get(`/admin/group/list?size=${pagination?.pageSize || 10}&page=${pagination?.current || 1}${
            searchText ? `&searchText=${searchText}` : ''
        }`)
        return {
            data:data?.rows || []
        }
    } catch (error) {
        throw error
    }

}