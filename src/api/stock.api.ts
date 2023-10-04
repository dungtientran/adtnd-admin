import axios from 'axios';

export const getStockList = async (params: string) => {
  try {
    const res = await axios.get(
      `https://yys2edw6d6.execute-api.ap-southeast-1.amazonaws.com/dev/stock/get-list-stock?${params}`,
    );

    return res.data?.data;
  } catch (error) {
    console.log(error);
  }
};
