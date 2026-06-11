import { ref } from 'vue';
import { ElLoading } from 'element-plus';
import { ElMessage } from 'element-plus';
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';
import dateFormat from 'dateformat';
import { jsPDF } from 'jspdf';
// import { apiBankSumKasBank } from '../api/apiBank';

export const dillScssExportToJson = (scssExportJson) => {
  let jsonString = scssExportJson.replace(/:export\s*/, '').replace(/[\s+\r\n]/g, '');
  let scssJson = {};
  jsonString
    .slice(1, jsonString.length - 2)
    .split(';')
    .forEach((fItem) => {
      let arr = fItem.split(':');
      scssJson[arr[0]] = arr[1];
    });
  return scssJson;
};

export const isValElForm = (elForm) => {
  return new Promise((resolve) => {
    elForm.validate((isValid) => resolve(isValid));
  });
};

export const loading = () => {
  const load = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
  });
  return load;
};

export const setLoading = () => {
  const load = loading();

  setTimeout(() => {
    load.close();
  }, 200);
};

export const messageInfo = (message, type) => {
  return ElMessage({
    message: message,
    type: type ? type : 'error',
  });
};

export const saveTokenToCookie = async (jwtToken) => {
  const decoded = await jwt_decode(jwtToken);
  const asDate = new Date(decoded.exp * 1e3);
  //cookies will be automatically deleted by the browser if it expires
  Cookies.set('ACCESS', jwtToken, { expires: asDate, secure: false });
};

export const getDifferentObject = (object1, object2) => {
  let returnObj = {};
  Object.entries(object1).forEach((element) => {
    const [key, value] = element;
    if (object1[key] != object2[key]) {
      returnObj[key] = value;
    }
  });
  return returnObj;
};

export const valueOrUndefined = (value) => {
  if (value) return value;
  return undefined;
};

export const paginateObj = (pageIndex, pageSize, textSearch, newObj = {}) => {
  let obj = {
    'd-offset': pageIndex,
    'd-limit': pageSize,
    'd-search': valueOrUndefined(textSearch),
  };
  obj = { ...obj, ...newObj };

  return obj;
};

export const isObjectEmpty = (object) => {
  if (!object) return true;
  if (Object.keys(object).length === 0) return true;
  return false;
};

export const convertRp = (money) => {
  if (!money) return 'Rp 0';
  money = parseFloat(money);
  if (money % 1 !== 0)
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 1, maximumFractionDigits: 2 }).format(money);

  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(money);
};

export const convertMoneyCompact = (money) => {
  if (!money) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(parseInt(money));
};
export const convertToTreeDigit = (num) => {
  num = parseFloat(num);
  if (num % 1 !== 0)
    return num
      .toFixed(2)
      .toString()
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
};

export const textSearchObj = (keyword) => {
  return {
    TEXT_SEARCH: keyword,
  };
};

export const dateFormatFull = (date) => {
  return dateFormat(date, import.meta.env.VITE_FULL_DATE);
};

export const dateFormatShort = (date) => {
  return dateFormat(date, import.meta.env.VITE_SHORT_DATE);
};

export const timeFormat = (date) => {
  return dateFormat(date, 'HH:MM');
};

export const cloneFromReactive = (src) => {
  return JSON.parse(JSON.stringify(src));
};

export const nowDate = () => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  today = dd + '/' + mm + '/' + yyyy;
  return today;
};

let timeout = null;
export const createDebounce = (fn = () => {}, time = 500) => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    fn();
  }, time);
};

export const SUMKas = () => {
  const sumKasBankData = ref(null);
  let lastCall = 0;
  let branch = '';

  const callSUMKas = async (branchName) => {
    if (lastCall > new Date().getTime() / 1000 && branch === branchName) return;
    lastCall = new Date().getTime() / 1000 + 120;
    branch = branchName;
    try {
      // const { data } = await apiBankSumKasBank();
      sumKasBankData.value = parseFloat(69);
    } catch (error) {
      sumKasBankData.value = null;
    }
  };

  return { sumKasBankData, callSUMKas };
};

export async function getAddress({ latitude, longitude }) {
  try {
    if (!latitude || !longitude) {
      return [];
    }

    const requestOptions = {
      method: 'GET',
      redirect: 'follow',
      headers: {
        'Allow-Control-Allow-Origin': '*',
      },
    };
    const data = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${latitude},${longitude}&format=json&addressdetails=true&namedetails=true`,
      { ...requestOptions, signal: AbortSignal.timeout(30000) },
    );
    return await data.json();
  } catch (error) {
    // // console.log(error);
    return [];
  }
}

export const generateSuratPengiriman = (viewData) => {
  // // console.log(viewData);

  const doc = new jsPDF();

  const company = viewData.Nama_Customer;
  const price = viewData.Estimasi_Omset;
  const alamat = viewData.Alamat;
  const kota = viewData.Kota;
  const kontak = viewData.Kontak_Person;
  const sales_phone = viewData.phone_sales || '-';
  const sales_name = viewData.nama_sales || '-';
  const jabatan_sales = viewData.CodeJb ? viewData.CodeJb.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase()) : '-';
  const email = viewData.email_sales;
  const nomor = viewData.nomor_surat;
  const today = new Date();
  const tanggal = `Jakarta, ${today.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })}`;

  // // console.log(tanggal);
  const pageHeight = doc.internal.pageSize.height;
  // const price = viewData.value?.publish_price || 0;

  let y = 11;

  doc.setFont('Times', 'Normal');
  doc.setFontSize(9);

  // Nomor

  y += 10;
  doc.addImage('/wahana.png', 'PNG', 150, y - 15, 50, 15);
  doc.text(`No. ${nomor}`, 20, y);
  y += 10;

  // Kepada
  doc.text('Kepada Yth.', 20, y);
  y += 5;
  doc.text(company, 20, y);
  y += 5;
  doc.text(`${alamat}, ${kota}`, 20, y, { maxWidth: 170 });
  y += 10;

  doc.text(`Attn : ${kontak}`, 20, y);
  y += 5;

  // Perihal
  doc.setFont('Times', 'Bold');
  doc.text('Perihal : Penawaran Kerjasama Pengiriman Paket dan Dokumen', 20, y);
  doc.setFont('Times', 'Normal');
  y += 10;

  // Pembuka
  doc.text('Salam Sejahtera', 20, y);
  y += 7;

  doc.text('Bersama dengan surat ini, kami ingin memperkenalkan Perusahaan kami PT Wahana Prestasi Logistik yang bergerak dibidang', 20, y);
  y += 5;

  doc.text('jasa pengiriman paket dan dokumen ke seluruh wilayah Indonesia.', 20, y);
  y += 10;

  doc.text('Kami bermaksud untuk mengajukan penawaran kerja sama dalam hal pengiriman paket dan dokumen Perusahaan', 20, y);
  y += 5;

  doc.text('Bapak/Ibu.', 20, y);
  y += 8;

  doc.text('Dibawah ini adalah jenis layanan yang saat ini dapat kami berikan :', 20, y);
  y += 8;

  // List layanan
  doc.text('1. Kebutuhan paket atau dokumen secara hub atau schedule ke lokasi Regular.', 25, y);
  y += 5;

  doc.text('2. Memberikan fasilitas akses login dashboard khusus untuk online yang kami miliki agar perusahaan', 25, y);
  y += 5;

  doc.text('    Bapak/Ibu dapat melakukan :', 25, y);
  y += 5;

  doc.text('- Pembuatan resi pengiriman (mencetak resi pengiriman)', 30, y);
  y += 5;

  doc.text('- Pelacakan pengiriman (tracking) dan reporting pengiriman.', 30, y);
  y += 8;

  doc.text('3. Biaya pengiriman yang ekonomis dan kompetitif dibanding perusahaan lain yang sejenis.', 25, y);
  y += 8;

  doc.text('4. Jenis layanan pengiriman yang kami miliki saat ini :', 25, y);
  y += 5;

  doc.text('- NextDay', 30, y);
  y += 5;

  doc.text('- Express Regular', 30, y);
  y += 5;

  doc.text('- Jasa Pengiriman Kargo', 30, y);
  y += 10;

  // Penutup
  doc.text('Sebagai bahan pertimbangan untuk penawaran yang sudah kami paparkan diatas, kami lampirkan juga profil ', 20, y);
  y += 5;

  doc.text('perusahaan kami.', 20, y);
  y += 8;

  doc.text('Apabila ada hal-hal yang ingin ditanyakan atau disampaikan kepada kami, Bapak/Ibu dapat menghubungi kami', 20, y);
  y += 5;
  // Apabila ada hal-hal yang ingin ditanyakan atau disampaikan kepada kami,
  // Bapak/Ibu dapat menghubungi kami di nomor HP ………..(a/n ……………) atau dengan membalas email kami ini.

  doc.text(`di nomor HP ${sales_phone} .(a/n ${sales_name}) atau dengan membalas email kami ini.`, 20, y);
  y += 8;

  doc.text('Demikian surat ini kami sampaikan semoga dapat terjalin kerjasama yang baik kedepannya.', 20, y);
  y += 5;

  doc.text('Atas perhatian dan kerjasamanya kami ucapkan terima kasih.', 20, y);
  y += 10;

  // Tanggal
  doc.text(tanggal, 20, y);
  y += 8;

  // TTD
  doc.text('PT Wahana Prestasi Logistik', 20, y);
  y += 20;

  doc.setFont(undefined, 'bold');
  doc.text(`(${sales_name})`, 20, y);

  doc.setFont(undefined, 'normal');
  doc.text(`${jabatan_sales}`, 20, y + 4);

  y += 12;

  // Email & HP
  doc.text(`Email : ${email} `, 20, y);
  doc.text(`Hp : ${sales_phone}`, 20, y + 5);

  y += 15;

  // kiri
  doc.text('PT Wahana Prestasi Logistik', 20, y);

  // kanan
  doc.text('Kantor Pusat', 145, y);
  y += 5;

  doc.text('Jl. Rempoa Raya No. 88 Rempoa Ciputat', 145, y);
  y += 5;

  doc.text('Tangerang Selatan', 145, y);
  y += 5;

  doc.text('Telepon : 021-7341688', 145, y);
  y += 5;

  doc.text('www.wahana.com', 145, y);

  doc.addImage('/footer-img.png', 'PNG', 0, pageHeight - 25, 210, 25);

  doc.save(`Penawaran-${company}-Kirim_Paket.pdf`);
};

export const generateFormCustomer = (viewData) => {
  const doc = new jsPDF('p', 'mm', 'a4');

  const left = 15;
  let y = 0;

  const nama_perusahaan = viewData.Nama_Customer || '';
  const alamat_perusahaan = viewData.Alamat || '';
  const kode_pos = '';
  const no_telephone = viewData.No_Handphone || '';
  const no_fax = '';
  const website = '';
  const npwp = '';
  const bidang = viewData.Jenis_Industri || '';
  const sistem_pembayaran = '';
  const type_harga = viewData.type_harga || '';
  const Handphone_pickup = viewData.handphone_pickup || '';
  const alamat1 = viewData.alamat_pickup || '';
  const alamat2 = '';
  const alamat3 = '';
  const kodepos2 = '';
  const kodepos3 = '';
  const kodepos1 = '';
  const alamat_penagihan = viewData.alamat_penagihan || '';
  const discount = viewData.discount || '';
  const contact_pickup = viewData.contact_pickup || '';
  const contact_pembayaran = viewData.contact_pembayaran || '';
  const email_penagihan = viewData.email_penagihan || '';
  const handphone_pembayaran = viewData.handphone_pembayaran || '';
  const email_pickup = viewData.email_pickup || '';
  const sales_name = viewData.nama_sales || '-';
  const jabatan = '';
  const tutup_kantor = '';
  const w_pengambilan = viewData.order_pickup || '';
  const kontak = viewData.Kontak_Person || '-';
  const jabatan_sales = viewData.CodeJb ? viewData.CodeJb.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase()) : '-';
  const jabatan_customer = viewData.Jabatan || '-';

  doc.setFontSize(8);
  y += 10;
  doc.text('NO :', 150, 12);

  doc.addImage('/wahana.png', 'PNG', left, y - 5, 45, 12);
  y = 15;

  doc.rect(150, y, 4, 4);
  doc.text('Pelanggan Baru', 156, y + 3);

  y += 5;

  doc.rect(150, y, 4, 4);
  doc.text('Pelanggan Lama Kembali', 156, y + 3);
  y += 7;

  doc.setFillColor(0, 51, 153);
  doc.rect(10, y, 190, 6, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.text('FORM REGISTRASI PELANGGAN (FRP)', 60, y + 4);

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(8);

  y += 12;
  doc.text('Nama Perusahaan', 15, y);
  doc.text(':', 55, y);
  doc.text(nama_perusahaan.substring(0, 150), 60, y - 2);
  doc.line(60, y, 195, y);
  y += 5;

  doc.text('Alamat Perusahaan', 15, y);
  doc.text(':', 55, y);

  const maxWidth = 135; // dari x:60 sampai 195 → 195 - 60

  const alamatLines = doc.splitTextToSize(alamat_perusahaan || '', maxWidth);

  alamatLines.forEach((line, index) => {
    doc.text(line, 60, y - 2);
    doc.line(60, y, 195, y);
    y += 5;
  });

  // doc.text('Kode Pos', 125, y);
  // doc.text(':', 150, y);

  // doc.text(kode_pos, 153, y - 2);
  // doc.line(153, y, 195, y);

  // y += 5;

  doc.text('No. Telephone', 15, y);
  doc.text(':', 55, y);
  doc.text(no_telephone, 60, y - 2);
  doc.line(60, y, 120, y);

  doc.text('No. Fax', 125, y);
  doc.text(':', 150, y);
  doc.text(no_fax, 153, y - 2);
  doc.line(153, y, 195, y);
  y += 5;

  doc.text('Website', 15, y);
  doc.text(':', 55, y);
  doc.text(website.substring(0, 80), 60, y - 2);
  doc.line(60, y, 195, y);
  y += 5;

  doc.text('No. NPWP', 15, y);
  doc.text(':', 55, y);
  doc.text(npwp, 60, y - 2);
  doc.line(60, y, 195, y);
  y += 5;

  doc.text('Bergerak di bidang', 15, y);
  doc.text(':', 55, y);
  doc.text(bidang.substring(0, 80), 60, y - 2);
  doc.line(60, y, 195, y);
  y += 2;

  doc.setFillColor(0, 51, 153);
  doc.rect(10, y, 190, 6, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.text('Informasi Pengambilan', 70, y + 4);

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(8);

  y += 12;
  doc.text('Waktu Pengambilan', 15, y);
  doc.text(':', 55, y);

  if (w_pengambilan === 'by_call') {
    doc.rect(60, y - 3, 4, 4, 'F');
  } else {
    doc.rect(60, y - 3, 4, 4);
  }
  doc.text('By. Phone', 66, y);

  if (w_pengambilan === 'email') {
    doc.rect(95, y - 3, 4, 4, 'F');
  } else {
    doc.rect(95, y - 3, 4, 4);
  }
  doc.text('By. Email', 101, y);

  if (w_pengambilan === 'rutin') {
    doc.rect(130, y - 3, 4, 4, 'F');
  } else {
    doc.rect(130, y - 3, 4, 4);
  }
  doc.text('Rutin', 136, y);
  doc.text('Hari', 150, y);
  doc.text(':', 165, y);
  doc.line(168, y, 195, y);

  y += 5;

  doc.text('Armada', 150, y);
  doc.text(':', 165, y);
  doc.line(168, y, 195, y);

  doc.text('Alamat Pengambilan', 15, y);

  y += 5;

  doc.text('Alamat 1', 15, y);
  doc.text(':', 55, y);

  const alamatLines1 = doc.splitTextToSize(alamat1 || '', maxWidth);

  alamatLines1.forEach((line, index) => {
    doc.text(line, 60, y - 2);
    doc.line(60, y, 195, y);
    y += 5;
  });

  doc.text('Kode Pos', 125, y);
  doc.text(':', 150, y);
  doc.text(kodepos1, 153, y - 2);
  doc.line(153, y, 195, y);
  y += 5;

  doc.text('Alamat 2', 15, y);
  doc.text(':', 55, y);

  doc.text(alamat2.substring(0, 90), 60, y - 2);
  doc.line(60, y, 195, y);

  y += 5;

  doc.text(alamat2.substring(90, 150), 60, y - 2);
  doc.line(60, y, 120, y);

  doc.text('Kode Pos', 125, y);
  doc.text(':', 150, y);

  doc.text(kodepos2, 153, y - 2);
  doc.line(153, y, 195, y);

  y += 5;

  doc.text('Alamat 3', 15, y);
  doc.text(':', 55, y);

  doc.text(alamat3.substring(0, 90), 60, y - 2);
  doc.line(60, y, 195, y);

  y += 5;

  doc.text(alamat3.substring(90, 150), 60, y - 2);
  doc.line(60, y, 120, y);

  doc.text('Kode Pos', 125, y);
  doc.text(':', 150, y);

  doc.text(kodepos3, 153, y - 2);
  doc.line(153, y, 195, y);

  y += 5;

  doc.text('No. Telephone', 15, y);
  doc.text(':', 55, y);
  doc.text(Handphone_pickup, 60, y - 2);
  doc.line(60, y, 120, y);

  doc.text('No. Fax', 125, y);
  doc.text(':', 150, y);
  doc.text(no_fax, 153, y - 2);
  doc.line(153, y, 195, y);

  y += 5;

  doc.text('Penanggung Jawab', 15, y);
  doc.text(':', 55, y);
  doc.text(contact_pickup, 60, y - 2);
  doc.line(60, y, 120, y);

  doc.text('Jabatan', 125, y);
  doc.text(':', 150, y);
  doc.text(jabatan, 153, y - 2);
  doc.line(153, y, 195, y);

  y += 5;

  doc.text('Tutup Kantor', 15, y);
  doc.text(':', 55, y);
  doc.text(tutup_kantor.substring(0, 80), 60, y - 2);
  doc.line(60, y, 195, y);

  y += 5;

  doc.text('Alamat E-mail', 15, y);
  doc.text(':', 55, y);
  doc.text(''.substring(0, 80), 60, y - 2);
  doc.line(60, y, 195, y);

  y += 2;

  doc.setFillColor(0, 51, 153);
  doc.rect(10, y, 190, 6, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.text('Informasi Penagihan', 70, y + 4);

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(8);

  y += 12;

  doc.text('Sistem Pembayaran', 15, y);
  doc.text(':', 55, y);

  if (sistem_pembayaran === 'tunai') {
    doc.rect(60, y - 3, 4, 4, 'F');
  } else {
    doc.rect(60, y - 3, 4, 4);
  }
  doc.text('Tunai', 66, y);

  if (sistem_pembayaran === 'credit') {
    doc.rect(95, y - 3, 4, 4, 'F');
  } else {
    doc.rect(95, y - 3, 4, 4);
  }
  doc.text('Kredit, Dengan Minimum Invoice Perbulan: Rp. 1.000.000,-', 101, y);
  y += 8;

  doc.text('Harga Yang Dipergunakan', 15, y);
  doc.text(':', 55, y);
  doc.text(type_harga, 60, y - 2);
  doc.line(60, y, 120, y);

  doc.text('Discount', 125, y);
  doc.text(':', 150, y);
  doc.text(discount, 153, y - 2);
  doc.line(153, y, 195, y);
  y += 5;

  doc.text('Alamat Penagihan', 15, y);
  doc.text(':', 55, y);

  const alamatLines_penagihan = doc.splitTextToSize(alamat_penagihan || '', maxWidth);

  alamatLines_penagihan.forEach((line, index) => {
    doc.text(line, 60, y - 2);
    doc.line(60, y, 195, y);
    y += 5;
  });

  doc.text('Kode Pos', 125, y);
  doc.text(':', 150, y);

  doc.text('', 153, y - 2);
  doc.line(153, y, 195, y);

  y += 5;

  doc.text('No.Handphone', 15, y);
  doc.text(':', 55, y);
  doc.text(handphone_pembayaran, 60, y - 2);
  doc.line(60, y, 120, y);

  doc.text('No.Fax', 125, y);
  doc.text(':', 150, y);
  doc.text('', 153, y - 2);
  doc.line(153, y, 195, y);

  y += 5;

  doc.text('Penanggung Jawab', 15, y);
  doc.text(':', 55, y);
  doc.text(contact_pembayaran, 60, y - 2);
  doc.line(60, y, 120, y);

  doc.text('Jabatan', 125, y);
  doc.text(':', 150, y);
  doc.text(jabatan, 153, y - 2);
  doc.line(153, y, 195, y);

  y += 5;

  doc.text('Tutup Kantor', 15, y);
  doc.text(':', 55, y);
  doc.text(tutup_kantor.substring(0, 80), 60, y - 2);
  doc.line(60, y, 195, y);

  y += 5;

  doc.text('Alamat E-mail', 15, y);
  doc.text(':', 55, y);
  doc.text(email_penagihan.substring(0, 80), 60, y - 2);
  doc.line(60, y, 195, y);

  y += 2;

  doc.setFillColor(0, 51, 153);
  doc.rect(10, y, 190, 6, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.text('Informasi Lainnya', 70, y + 4);

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(8);
  y += 10;
  // List layanan
  doc.text(
    '1. Disetiap penagihan kami akan mencantumkan PPN Sebesar 1.1% dan bukti setor akan dikirimkan bersamaan dengan pengiriman invoice',
    15,
    y,
  );
  y += 5;

  doc.text('2. Kami Tidak melakukan cek isi barang kiriman/paket', 15, y);
  y += 5;
  doc.text(
    '3. Apabila hitungan volumetrik lebih berat dari berat aktual, maka biaya kirim berdasarkan berat volumetrik untuk Layanan Express P x L x T : 6000 =  kg ',
    15,
    y,
  );
  y += 5;
  doc.text('   dan volumetrik layanan Kargo : P x L x T : 4000 = Kg', 15, y);
  y += 2;

  doc.setFillColor(0, 51, 153);
  doc.rect(10, y, 190, 6, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.text('Diisi Oleh Account Executive', 70, y + 4);

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(8);
  y += 12;

  doc.text('Prediksi Penjualan', 15, y);
  doc.text(':', 55, y);
  doc.text(''.substring(0, 80), 60, y - 2);
  doc.line(60, y, 195, y);

  y += 5;

  doc.text('Tanggal Perjanjian', 15, y);
  doc.text(':', 55, y);
  doc.text(''.substring(0, 80), 60, y - 2);
  doc.line(60, y, 195, y);
  y += 5;

  doc.text('Berlaku Sampai Dengan', 15, y);
  doc.text(':', 55, y);
  doc.text(''.substring(0, 80), 60, y - 2);
  doc.line(60, y, 195, y);

  y += 5;

  doc.text('Alamat E-mail', 15, y);
  doc.text(':', 55, y);
  doc.text(''.substring(0, 80), 60, y - 2);
  doc.line(60, y, 195, y);

  y += 5;

  doc.text(
    ' * Dengan  melengkapi  konfirmasi  ini,  maka  pelanggan  jasa  setuju  pada  semua kondisi dan informasi yang telah disepakati bersama',
    15,
    y,
  );

  y += 2;

  doc.setFillColor(0, 51, 153);
  doc.rect(10, y, 190, 6, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.text('Wahana Prestasi Logistik', 20, y + 4);
  doc.text('Pelanggan', 140, y + 4);

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(8);

  y += 12;

  doc.text('Penanggung Jawab', 15, y);
  doc.text(':', 55, y);
  doc.text(sales_name, 60, y - 2);

  doc.text('Penanggung Jawab', 105, y);
  doc.text(':', 145, y);
  doc.text(kontak, 153, y - 2);

  y += 6;

  doc.text('Jabatan', 15, y);
  doc.text(':', 55, y);
  doc.text(jabatan_sales, 60, y - 2);

  doc.text('Jabatan', 105, y);
  doc.text(':', 145, y);
  doc.text(jabatan_customer, 153, y - 2);

  y += 6;

  doc.text('Tanda Tangan dan Stamp', 15, y);
  doc.text(':', 55, y);

  doc.text('Tanda Tangan dan Stamp', 105, y);
  doc.text(':', 145, y);

  y += 6;

  doc.line(10, y, 200, y);

  y += 4;

  doc.setFontSize(7);

  doc.text('Lbr. 1 Keuangan Pusat', 15, y);
  doc.text('Lbr. 2 Pelanggan', 70, y);
  doc.text('Lbr. 3 Keuangan Cabang', 120, y);
  doc.text('Lbr. 4 Marketing Pusat', 165, y);

  doc.save(` form Registrasi Pelanggan ${nama_perusahaan}.pdf`);
};

export const generateInfoCustomer = (viewData) => {
  const doc = new jsPDF('p', 'mm', 'a4');

  const id =  '';
  const nama_perusahaan = viewData.Nama_Customer || '';
  const no_telephone = viewData.No_Handphone || '';
  const data_dibuat = viewData.Create_at || '';
  const bidang = viewData.Jenis_Industri || '';
  const sistem_pembayaran = viewData.Metode_Pembayaran || '';
  const type_harga = viewData.type_harga || '';
  const Handphone_pickup = viewData.handphone_pickup || '';
  const alamat1 = viewData.alamat_pickup || '';
  const alamat_penagihan = viewData.alamat_penagihan || '';
  const discount = viewData.discount || '';
  const contact_pickup = viewData.contact_pickup || '';
  const contact_pembayaran = viewData.contact_pembayaran || '';
  const email_penagihan = viewData.email_penagihan || '';
  const email_report = viewData.email_report || '';
  const handphone_pembayaran = viewData.handphone_pembayaran || '';
  const sales_name = viewData.nama_sales || '-';
  const tujuan = viewData.Tujuan || '';
  const lampiran_tkk = viewData.lampiran_ttk || '';
  const lampiran_surat_jalan = viewData.lampiran_surat_jalan || '';
  const pembuatan_invoice = viewData.pembuatan_invoice || '';
  const email_profoma = viewData.email_profoma || '';
  const Jangka_Pembayaran = viewData.Jangka_Pembayaran || '';
  const layanan = viewData.nedd_type || '';
  const perlu_reporting = viewData.perlu_reporting || '';
  const jangka_report_kiriman = viewData.jangka_report_kiriman || '';
  const sistem_ttk = viewData.sistem_ttk || '';
  const packing_kayu = viewData.packing_kayu || '';
  const tangal_mulai = viewData.tangal_mulai || '';
  const jam_pickup = viewData.jam_pickup || '';
  const informasi_tambahan = viewData.informasi_tambahan || '';

  const jabatan = '';
  const tutup_kantor = '';
  const w_pengambilan = viewData.order_pickup || '';
  const kontak = viewData.Kontak_Person || '-';
  const jabatan_sales = viewData.CodeJb ? viewData.CodeJb.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase()) : '-';
  const jabatan_customer = viewData.Jabatan || '-';

  // =========================
  // STYLE
  // =========================
  const purple = [55, 48, 163];
  const borderColor = [0, 0, 0];

  const startX = 10;
  const col1 = 70;
  const col2 = 5;
  const col3 = 115;

  let y = 10;

  const rowHeight = 6;

  const drawRow = (label, value) => {
    const text = doc.splitTextToSize(String(value), col3 - 4);
    const dynamicHeight = Math.max(rowHeight, text.length * 4);

    doc.rect(startX, y, col1, dynamicHeight);
    doc.rect(startX + col1, y, col2, dynamicHeight);
    doc.rect(startX + col1 + col2, y, col3, dynamicHeight);

    doc.setFontSize(8);

    doc.text(label, startX + 2, y + 4);
    doc.text(':', startX + col1 + 2, y + 4);
    doc.text(text, startX + col1 + col2 + 2, y + 4);

    y += dynamicHeight;
  };
  const drawHeader = (title) => {
    doc.setFillColor(...purple);
    doc.rect(startX, y, col1 + col2 + col3, rowHeight, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text(title, startX + 2, y + 4);

    doc.setTextColor(0, 0, 0);

    y += rowHeight;
  };

  // =========================
  // TITLE
  // =========================

  doc.setFillColor(...purple);
  doc.rect(startX, y, col1 + col2 + col3, 8, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.text('FORM INFORMASI CUSTOMER BARU', 105, y + 5, { align: 'center' });

  doc.setTextColor(0, 0, 0);
  y += 8;

  drawRow('Tanggal', data_dibuat);

  // =========================
  // DATA CUSTOMER
  // =========================

  drawHeader('DATA CUSTOMER');

  drawRow('Nama Customer', nama_perusahaan);
  drawRow('ID Akun', id);
  drawRow('Jenis Kiriman', bidang);
  drawRow('Tujuan pengiriman', tujuan);

  // =========================
  // INVOICE
  // =========================

  drawHeader('INVOICE DAN PEMBAYARAN');

  drawRow('Jenis Pembayaran (Invoice / Deposit)', sistem_pembayaran);
  drawRow('Perlu lampiran TTK Balik (Y/T)', lampiran_tkk);
  drawRow('Perlu lampiran Surat Jalan/DO Balik (Y/T)', lampiran_surat_jalan);
  drawRow('Periode pembuatan Invoice', pembuatan_invoice);
  drawRow('Perlu email proforma invoice (Y/T)', email_profoma);
  drawRow('Jangka Waktu Pembayaran', Jangka_Pembayaran);
  drawRow('Alamat Penagihan', alamat_penagihan);
  drawRow('Contact Person', contact_pembayaran);
  drawRow('No Hp', handphone_pembayaran);
  drawRow('Email', email_penagihan);

  // =========================
  // HARGA
  // =========================

  drawHeader('HARGA LAYANAN DAN PELAPORAN');

  drawRow('Harga yang digunakan', type_harga);
  drawRow('Discount', discount + '%');
  drawRow('Layanan yang digunakan', layanan);
  drawRow('Perlu Reporting pengiriman (Y/T)', perlu_reporting);
  drawRow('Pengiriman reporting', jangka_report_kiriman);
  drawRow('Email reporting ditujukan ke', email_report);

  // =========================
  // PICKUP
  // =========================

  drawHeader('PICKUP DAN PROSES');

  drawRow('Sistem Input TTK', sistem_ttk);
  drawRow('Packing Kayu', packing_kayu);
  drawRow('Order Pick Up', w_pengambilan);
  drawRow('Tanggal Mulai Pengiriman', tangal_mulai);
  drawRow('Alamat Pickup', alamat1);
  drawRow('Jam Pick Up', jam_pickup);
  drawRow('Contact Person', contact_pickup);
  drawRow('No Hp', Handphone_pickup);

  // =========================
  // INFORMASI TAMBAHAN
  // =========================

  drawHeader('INFORMASI TAMBAHAN');

  const infoHeight = 20;

  doc.rect(startX, y, col1 + col2 + col3, infoHeight);

  doc.setFontSize(7);

  doc.text(informasi_tambahan, startX + 2, y + 5);

  y += infoHeight;

  // =========================
  // SALES
  // =========================

  drawHeader('SALES');

  drawRow('Nama Sales', sales_name);

  // =========================

  doc.save(` form Informasi Customer ${nama_perusahaan}.pdf`);
};

export const generateSuratSewaArmadaLk = async (viewData) => {
  // // console.log(viewData);

  const doc = new jsPDF();

  const company = viewData.Nama_Customer;
  const price = viewData.Estimasi_Omset;
  const alamat = viewData.Alamat;
  const kota = viewData.Kota;
  const kontak = viewData.Kontak_Person;
  const sales_phone = viewData.phone_sales || '-';
  const sales_name = viewData.nama_sales || '-';
  const jabatan_sales = viewData.CodeJb ? viewData.CodeJb.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase()) : '-';
  const email = viewData.email_sales;
  const nomor = viewData.nomor_surat;
  const today = new Date();
  const tanggal = `Tangerang Selatan, ${today.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })}`;

  // // console.log(tanggal);
  const pageHeight = doc.internal.pageSize.height;
  // const price = viewData.value?.publish_price || 0;

  let y = 11;

  doc.setFont('Times', 'Normal');
  doc.setFontSize(9);

  // Nomor

  y += 10;
  doc.addImage('/wahana.png', 'PNG', 150, y - 15, 50, 15);
  doc.text(`No. ${nomor}`, 20, y);
  y += 10;

  // Kepada
  doc.text('Kepada Yth.', 20, y);
  y += 5;
  doc.text(company, 20, y);
  y += 5;
  doc.text(`${alamat}, ${kota}`, 20, y, { maxWidth: 170 });
  y += 10;

  doc.text(`Attn : ${kontak}`, 20, y);
  y += 5;

  // Perihal
  doc.setFont('Times', 'Bold');
  doc.text('Perihal :  Penawaran Harga Sewa Armada Lepas Kunci', 20, y);
  doc.setFont('Times', 'Normal');
  y += 10;

  // Pembuka
  doc.setFontSize(9);

  doc.text('Dengan Hormat,', 20, y);
  y += 6;

  doc.text('Sebelumnya kami ucapkan terimakasih atas kesempatan dan kepercayaan yang telah diberikan kepada kami, bersama ini kami sampaikan', 20, y);
  y += 5;

  doc.text(`penawaran harga sewa armada sesuai kebutuhan ${company}`, 20, y);
  y += 5;

  const img = new Image();
  img.src = '/sewa-armada.png';

  await new Promise((resolve) => {
    img.onload = resolve;
  });

  const imgWidth = 170;
  const imgHeight = (img.height * imgWidth) / img.width;

  doc.addImage(img, 'PNG', 20, y, imgWidth, imgHeight);

  y += imgHeight + 10;

  // =========================
  // KETENTUAN
  // =========================
  doc.setFontSize(9);

  const ketentuan = [
    'Ketentuan :',
    '1. Harga belum termasuk pajak PPN 11% untuk plat Hitam, dan harga sudah termasuk pajak PPN untuk plat kuning.',
    '2. Pembayaran harga sewa wajib dilakukan paling lambat 14 (empat belas) hari kerja setelah invoice diterima (Term of Payment/TOP)',
    '3. Bilamana TOP jatuh pada hari Sabtu/Minggu/Libur Nasional atau hari tutup operasional bank maka pembayaran dilakukan sebelum waktu-waktu tersebut di atas.',
    '4. Harga tersebut Sudah termasuk fasilitas GPS.',
    '5. Area penggunaan armada hanya untuk  area JABODETABEK.',
    '6. Apabila pemakaian kilometer melebihi batasan kilometer pertahun maka akan dikenakan charge tambahan kelebihan per kilometer sesuai tabel jenis unit.',
    '7. Apabila terjadi penghentian sepihak dari penyewa sebelum masa sewa berakhir, maka sisa biaya sewa sampai dengan akhir masa sewa wajib di lunasi oleh penyewa',
    '8. Lokasi Penyerahan dan pengembalian unit adalah di area JABODETABEK',
    '9. Ketentuan lainnya mengikuti Perjanjian Kerjasama (PKS) sewa armada.'
  ];

  ketentuan.forEach((text) => {
    const splitText = doc.splitTextToSize(text, 170);
    doc.text(splitText, 20, y);
    y += splitText.length * 4;
  });

  y += 5;

  // =========================
  // PENUTUP
  // =========================
  doc.text('Demikian hal ini dapat kami sampaikan semoga dapat terjalin kerjasama yang baik kedepannya.', 20, y);
  y += 5;

  doc.text('Atas perhatian dan kerjasamanya kami ucapkan terima kasih.', 20, y);
  y += 8;

  // Tanggal
  doc.text(tanggal, 20, y);
  y += 8;

  // TTD
  doc.text('PT Wahana Prestasi Logistik', 20, y);
  y += 15;

  doc.setFont(undefined, 'bold');
  doc.text(`(${sales_name})`, 20, y);

  doc.setFont(undefined, 'normal');
  doc.text(`${jabatan_sales}`, 20, y + 4);

  y += 12;

  // Email & HP
  doc.text(`Email : ${email} `, 20, y);
  doc.text(`Hp : ${sales_phone}`, 20, y + 5);

  y += 10;

  // kiri
  doc.text('PT Wahana Prestasi Logistik', 20, y);

  // kanan
  doc.text('Kantor Pusat', 145, y);
  y += 5;

  doc.text('Jl. Rempoa Raya No. 88 Rempoa Ciputat', 145, y);
  y += 5;

  doc.text('Tangerang Selatan', 145, y);
  y += 5;

  doc.text('Telepon : 021-7341688', 145, y);
  y += 5;

  doc.text('www.wahana.com', 145, y);

  doc.addImage('/footer-img.png', 'PNG', 0, pageHeight - 25, 210, 25);

  doc.save(`Penawaran-${company}-Sewa_Armada.pdf`);
};

export const generateSuratSewaArmadaFtl = async (viewData) => {
  // // console.log(viewData);

  const doc = new jsPDF();

  const company = viewData.Nama_Customer;
  const price = viewData.Estimasi_Omset;
  const alamat = viewData.Alamat;
  const kota = viewData.Kota;
  const kontak = viewData.Kontak_Person;
  const sales_phone = viewData.phone_sales || '-';
  const sales_name = viewData.nama_sales || '-';
  const jabatan_sales = viewData.CodeJb ? viewData.CodeJb.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase()) : '-';
  const email = viewData.email_sales;
  const nomor = viewData.nomor_surat;
  const today = new Date();
  const tanggal = `Tangerang Selatan, ${today.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })}`;

  // // console.log(tanggal);
  const pageHeight = doc.internal.pageSize.height;
  // const price = viewData.value?.publish_price || 0;

  let y = 11;

  doc.setFont('Times', 'Normal');
  doc.setFontSize(9);

  // Nomor

  y += 10;
  doc.addImage('/wahana.png', 'PNG', 150, y - 15, 50, 15);
  doc.text(`No. ${nomor}`, 20, y);
  y += 10;

  // Kepada
  doc.text('Kepada Yth.', 20, y);
  y += 5;
  doc.text(company, 20, y);
  y += 5;
  doc.text(`${alamat}, ${kota}`, 20, y, { maxWidth: 170 });
  y += 10;

  // Perihal
  doc.setFont('Times', 'Bold');
  doc.text('Perihal :  Penawaran Harga Sewa Armada Per Trip', 20, y);
  doc.setFont('Times', 'Normal');
  y += 10;

  // Pembuka
  doc.setFontSize(9);

  doc.text('Dengan Hormat,', 20, y);
  y += 6;

  doc.text('Sebelumnya kami ucapkan terimakasih atas kesempatan dan kepercayaan yang telah diberikan kepada kami, bersama ini kami sampaikan', 20, y);
  y += 5;

  doc.text(`penawaran harga sewa armada per trip (FTL)  sesuai kebutuhan ${company}`, 20, y);
  y += 5;

  const img = new Image();
  img.src = '/ftl3.png';

  await new Promise((resolve) => {
    img.onload = resolve;
  });

  const imgWidth = 120;
  const imgHeight = (img.height * imgWidth) / img.width;

  doc.addImage(img, 'PNG', 20, y, imgWidth, imgHeight);

  y += imgHeight + 5;

  // =========================
  // KETENTUAN
  // =========================
  doc.setFontSize(9);

const ketentuan = [
  '1. Harga belum termasuk pajak PPN 11%.',
  '2. Harga belum termasuk asuransi, Asuransi Pengiriman sebesar 0.5% dari nilai barang.',
  '3. Order armada 1 hari sebelumnya.',
  '4. Harga belum termasuk biaya bongkar atau muat di lokasi pickup dan lokasi tujuan (apabila ada).',
  '5. Apabila konfirmasi order telah disetujui dan terjadi pembatalan, maka pembatalan order akan dikenakan pinalty 70% x harga per trip.',
  '6. Harga tersebut di atas adalah harga per trip untuk 1 titik tujuan.',
  '7. Biaya pertitik selanjutnya didalam kota yang sama sebagai berikut :',
  '   a. BLINDVAN Rp. 120,000',
  '   b. CDE Long Rp. 500,000',
  '   c. CDD Standar Rp. 500,000',
  '   d. CDD Long Rp. 500,000',
  '   e. FUSO Rp. 500,000',
  '8. Apabila truck tidak bisa bongkar di hari tersebut akan dikenakan biaya bermalam 60% x harga per trip.',
  '9. Harga tersebut dapat berubah sewaktu-waktu.',
  '10. Ketentuan lainnya mengikuti Perjanjian Kerjasama (PKS) sewa armada.'
];

  ketentuan.forEach((text) => {
    const splitText = doc.splitTextToSize(text, 180);
    doc.text(splitText, 20, y);
    y += splitText.length * 4;
  });

  y += 5;

  // =========================
  // PENUTUP
  // =========================
  doc.text('Demikian hal ini dapat kami sampaikan semoga dapat terjalin kerjasama yang baik kedepannya.', 20, y);
  y += 5;
  doc.text('Atas perhatian dan kerjasamanya kami ucapkan terima kasih.', 20, y);
  y += 5;

  // Tanggal
  doc.text(tanggal, 20, y);
  y += 8;

  // TTD
  doc.text('PT Wahana Prestasi Logistik', 20, y);
  y += 18;

  // doc.setFont(undefined, 'bold');
  // doc.text(`(${sales_name})`, 20, y);

  // doc.setFont(undefined, 'normal');
  // doc.text(`${jabatan_sales}`, 20, y + 4);

  // y += 12;

  // Email & HP
  doc.text(`Email : ${email} `, 20, y);
  doc.text(`Hp : ${sales_phone}`, 20, y + 5);

  y += 15;

  // kiri
  doc.text('PT Wahana Prestasi Logistik', 20, y);

  // kanan
  doc.text('Kantor Pusat', 145, y);
  y += 5;

  doc.text('Jl. Rempoa Raya No. 88 Rempoa Ciputat', 145, y);
  y += 5;

  doc.text('Tangerang Selatan', 145, y);
  y += 5;

  doc.text('Telepon : 021-7341688', 145, y);
  y += 5;

  doc.text('www.wahana.com', 145, y);

  doc.addImage('/footer-img.png', 'PNG', 0, pageHeight - 25, 210, 25);

  doc.save(`Penawaran-${company}-Sewa_Armada(Per-Trip).pdf`);
};

