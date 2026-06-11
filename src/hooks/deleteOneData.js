import { messageInfo } from '../helper/utils';
import { catchError } from '../helper/catchResp';

export default function useDeleteOneData(options = { returnAsArray: false }) {
  const deleteData = (callBack, apiURL, OBJECT_ID) => {
    catchError(async () => {
      const { status } = await apiURL(OBJECT_ID);
      if (status == 200) {
        messageInfo('Berhasil menghapus data', 'success');
        callBack();
      }
    });
  };

  if (options.returnAsArray) {
    return [deleteData];
  } else {
    return { deleteData };
  }
}
