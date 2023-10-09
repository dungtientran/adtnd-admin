import { axiosInstance } from "./request"
import { TablePaginationConfig } from "antd"
interface CreateGroup {
    name: string,
    description: string
    sale_id?: string
    subscription_product_id?: string
}
interface UpdateGroup {
    name: string,
    description: string
    sale_id?: string
    subscription_product_id?: string
}
export const getGroupList = async (pagination?: TablePaginationConfig | null, searchText?: string, filterQuery?: string) => {
    try {
        const data: any = await axiosInstance.get(`/admin/group/list?size=${pagination?.pageSize || 10}&page=${pagination?.current || 1}${
            searchText ? `&searchText=${searchText}` : ''
        }${filterQuery ? filterQuery : ''}`)
        return {
            data:data?.rows || [],
            count:data?.count 
        }
    } catch (error) {
        throw error
    }

}

export const createGroup = async (data: CreateGroup)=> {
    return axiosInstance.post(`/admin/group/create/`, data).then((data) => data).catch(error => {throw error});
}
export const updateGroup = async (group_id: string, data: UpdateGroup)  =>{
    return axiosInstance.put(`admin/group/update/${group_id}`, data).then((data) => data).catch(error => {throw error});
}

export const deleteGroup = (group_id?: any) =>
    axiosInstance.delete(`/admin/group/remove_group/${group_id}`).then((data) => data).catch(error => {throw error});