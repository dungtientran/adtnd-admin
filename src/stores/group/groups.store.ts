import { SubscriptionState } from './../subscriptions.store';
import { axiosInstance } from '@/api/request';
import { User} from '@/interface/user/user';
import { createAction, createSlice, Dispatch, PrepareAction } from '@reduxjs/toolkit';


// interface GroupMember {
//     customer: User,
//     customer_id: string,
//     group_id: number
// }
interface SubscriptionProduct {
    name: string 
    id: string
}


export interface GroupDetailState {
    groupDetail: {
        description: string;
        id: number;
        name: string,
        nav_high: string;
        nav_low: string;
        subscription_product_id: string;
        subscription_product: SubscriptionProduct;
        sale_id: string;
        member_count: number
    } | null
    groupMembers: {
        count: number,
        members:Array<User>
    }
}

const initialState: GroupDetailState = {
    groupDetail: null,
    groupMembers: {
        count: 0,
        members: []
    }
};


export const groupSlice = createSlice({
    name: 'group',
    initialState,
    reducers: {
        setgroup: (state, action) => {
            state.groupDetail = action.payload;
        },
        setGroupMember: (state, action) => {
            const data = action.payload?.rows?.map((row: any) => row?.customer)
            console.log('data ', data)
            state.groupMembers = {
                count: action.payload.count,
                members: data
            };
        }
    },
    extraReducers: () => {

    },
});

export const { setgroup,setGroupMember } = groupSlice.actions;

export default groupSlice.reducer;
