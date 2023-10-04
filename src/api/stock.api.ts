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

export const apiUpdateLogoStock = async (idStock: string, formData: any) => {
  try {
    const getUrlImage = await axios.post(`https://api.cloudinary.com/v1_1/dbkgkyh4h/image/upload`, formData);

    if (getUrlImage.status === 200) {
      console.log("kakkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk");
      const res = await axios.put(
        `https://yys2edw6d6.execute-api.ap-southeast-1.amazonaws.com/dev/stock/update_logo/${idStock}`,
        {
          logo_url: getUrlImage.data.url,
        },
        {
          headers: {
            Authorization:
              'Bearer eyJraWQiOiI3UXNIUHk4Q3VZU3N3aUhxK1E5K09qelwvR0xjRG8zOGJYXC94VjdDOG0yYTA9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiI4OWFhYzU4Yy0zMDcxLTcwMjMtMTQxNy1kYThmYjQ4Y2RlYjgiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuYXAtc291dGhlYXN0LTEuYW1hem9uYXdzLmNvbVwvYXAtc291dGhlYXN0LTFfY1AwU216TWRKIiwiY2xpZW50X2lkIjoiaGF2a3BzNHF1Y2hkM3AydmNwNWVwcnUyciIsIm9yaWdpbl9qdGkiOiI4MGY0YWQzOS1mNmNjLTRiODctYWU3Yy04YzcxMWJmOGI5NWIiLCJldmVudF9pZCI6IjI1NDk4MjM3LTMxM2QtNDIxNy1iZTM5LTIzYjNiMTJmYzAwMCIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE2OTYzMjQ5MjAsImV4cCI6MTY5NjQxMTMyMCwiaWF0IjoxNjk2MzI0OTIwLCJqdGkiOiI5MWUwMGY2Ny01YWFkLTQ5YTYtYjM1Ni05YzQyZDgxZDU1ZDQiLCJ1c2VybmFtZSI6Ijg5YWFjNThjLTMwNzEtNzAyMy0xNDE3LWRhOGZiNDhjZGViOCJ9.FZQVEu-Z3Y5V_RqJKBA5x2wetreOKQKCMMfW3l4_RbFWzRiprr42LZGuXc3AM5BVWlhuKQU3GhKX61HOht6UGWvDXyFU7iBBnCMXsWir-Xlc0uSwMxuSbazTR9NVE7nd0t3z_CGWdXk213MmzJ5wNG68mlIN-Rrq2O1uInNy5S3nTvxLotbUPmHys-mXqdYsj611G19w6APQnuzyglGHeY8_SZW_8v44_XJme-D2pWzYNCYKyTKWwEQ0YvPyZOrd978rOz8Lc4EmGb6JcrMEDu_d0xXppZfzxNna_c-Papf_z_HrAUU8EyNMGyscw_ZVPdPduOjXbx0iANmETBvdKg',
          },
        },
      );

      return res.data;
    } else {
      throw new Error('Lỗi upload image');
    }
  } catch (error) {
    console.log(error);
  }
};
