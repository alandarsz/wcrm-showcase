import { ref } from 'vue';

export default function useViewOneData(options = { returnAsArray: false }) {
  const viewData = ref({});
  const viewDialog = ref(false);

  const openViewDialog = async (ObjectView) => {
    viewDialog.value = true;
    viewData.value = ObjectView;
  };

  const closeView = () => (viewDialog.value = false);

  if (options.returnAsArray) {
    return [viewData, viewDialog, closeView, openViewDialog];
  } else {
    return { viewData, viewDialog, closeView, openViewDialog };
  }
}
