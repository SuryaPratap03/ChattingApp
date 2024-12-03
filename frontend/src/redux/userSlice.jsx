import {createSlice} from '@reduxjs/toolkit';

const userSlice = createSlice({
    name:'User',
    initialState:{
        value:{
            userId : '',
            username:'',
            profile_pic:''
        }
    },
    reducers:{
        addUserDetails(state,action){
            state.value = action.payload;
        },
        deleteUserDetails(state,action){
            state.value = {
              userId : '',
              username:'',
              profile_pic:''
            }
        }
    }
});

export const {addUserDetails,deleteUserDetails} = userSlice.actions;
export default userSlice.reducer; 
