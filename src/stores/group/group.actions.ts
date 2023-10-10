import { Dispatch } from "@reduxjs/toolkit"
import { axiosInstance } from "@/api/request"
import { newMember, setGroupMember, setgroup } from "./groups.store"
import { TablePaginationConfig, notification } from "antd"


export interface DeleteMemberForm {
    group_id: string,
    customer_id?: string
    customer_ids?: Array<string>
}

export const getGroupDetail = (id: string) => {
    return async (dispatch: Dispatch) => {
        try {
            const data = await axiosInstance.get('admin/group/detail/' + id)

            dispatch(setgroup(data.data))
        } catch (error) {
            dispatch(setgroup([]))
        }
    }
}

export const getGroupMember = (id: string, pagination?: TablePaginationConfig, filterQuery?: string) => {
    return async (dispatch: Dispatch) => {
        try {
            const data = await axiosInstance.get(
                'admin/group/member/' + id +
                `?page=${pagination?.current || 1}&size=${pagination?.pageSize || 10}${filterQuery}`
            )
            console.log('group member', data)
            dispatch(setGroupMember(data.data))
        } catch (error) {
            dispatch(setGroupMember([]))
        }
    }
}
export const updateGroupDetail = (id: any, form?: any) => {
    return async (dispatch: Dispatch) => {
        try {
            const data = await axiosInstance.put('admin/group/update/'+ id, form)
            if(data) {
                dispatch(setgroup(data.data))
                notification.success({ message: 'Cập nhật thành công!' })
            }
            return true
        } catch (error) {
            notification.success({ message: 'Cập nhật thất bại !' })
            return false
        }
    }
}

export const addmember = (record: any) => {
    return async (dispatch: Dispatch) => {
        dispatch(newMember(record))
    }
}
export const deleteGroupMember = (form: DeleteMemberForm) => {
    return async (dispatch: any) => {
        try {
            const data = await axiosInstance.post(
                'admin/group/remove_member/', form
            )
            console.log(' delete group member', data)
            if (data) {
                notification.success({ message: 'Xóa thành công!' })
                dispatch(getGroupMember(form.group_id))
            }
        } catch (error) {
            notification.error({ message: 'Xóa thất bại!' })
        }
    }
}

export const deleteGroup = (id: any) => {
    return async (dispatch: Dispatch) => {
        try {
            const data = await axiosInstance.delete('admin/group/remove_group/'+ id)
            if(data) {
                dispatch(setgroup({}))
                notification.success({ message: 'Xóa nhóm thành công!' })
                return true
            }
            return true
        } catch (error) {
            notification.success({ message: 'Xóa thất bại !' })
            return false
        }
    }
}