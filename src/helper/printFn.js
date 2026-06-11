import { ref } from 'vue';
import HOOKS from '../hooks/bundleOneOps';
import { isValElForm, dateFormatFull, messageInfo } from './utils';
import qz from 'qz-tray';
import { catchError } from './catchResp';

export const [printData, getPrintData, printDataLoading] = HOOKS.useGetData();

export const isFound = ref(false);
export const filterData = ref({});

function createButton(text = 'print', color = 'green', event = () => {}) {
  const blank = document.createElement('section');
  const section = `<section style="width: 100%; display: flex; flex-direction: row; justify-content: center;"><button style="margin: 10px 20px; padding: 10px 20px; background-color: ${color}; border-radius: 5px; color: rgb(255, 255, 255);">${text}</button></section>`;

  blank.innerHTML = section;
  document.body.prepend(blank);

  blank.getElementsByTagName('button')[0].addEventListener('click', event);
}

function removeButton() {
  const section = document.getElementsByTagName('section')[0];
  section.innerHTML = '';
}

// ini buat print
export const getData = (apiURL, title) => {
  getPrintData(
    () => apiURL(),
    true,
    false,
    (data) => {
      if (data.body?.length) {
        printDataLoading.value = false;
        isFound.value = true;

        if (title) {
          document.title = title + (data?.header?.PERIODE ? ` - ${data.header.PERIODE}` : ` - ${dateFormatFull()}`);
        }

        let paged = document.createElement('script');
        paged.setAttribute('src', '../js/paged.polyfill.js');
        document.head.appendChild(paged);

        const inv = setInterval(() => {
          if (document.getElementsByClassName('pagedjs_pages')?.[0]) {
            const thisElement = document.getElementsByClassName('pagedjs_page');
            const pageTotal = document.getElementsByClassName('pagedjs_pages')?.[0].getAttribute('style')?.replace(';', '')?.split(':')[1];
            const pageShow = document.getElementsByClassName('pagedjs_page')?.length;

            if (thisElement) {
              for (let i = 0; i < thisElement.length; i++) {
                thisElement[i].style.marginLeft = 'auto';
                thisElement[i].style.marginRight = 'auto';
              }
            }

            if (pageTotal == pageShow) {
              setTimeout(() => {
                createButton('Print', '#008e93', () => {
                  removeButton();
                  window.print();
                  window.close();
                });
              }, 500);
              clearInterval(inv);
            }
          }
        }, 100);
      }
    },
  );
};

// ini buat print report
export const getExcel = async (apiUrl, payload = [], urlPath) => {
  if (payload[0].TYPE_FILE != 'PDF') {
    const resultVal = await isValElForm(payload[1]);
    if (!resultVal) return;
    catchError(async () => {
      const { status, data } = await apiUrl(payload[0]);
      if (status == 200) {
        var download = document.createElement('a');
        download.href = `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${data?.data.BASE_64}`;
        download.download = `${data?.data.FILE_TITLE}-${data?.data.PERIODE ? data?.data.PERIODE : dateFormatFull()}.${data?.data.FILE_TYPE}`;
        download.click();
      }
    });
  } else {
    const resultVal = await isValElForm(payload[1]);
    if (!resultVal) return;
    window.open(`${urlPath.replace('/report', '/print')}?${new URLSearchParams(payload[0]).toString()}`);
  }
};

// ini buat barcode atau qz tray printing
export function getPrintQZTray() {
  const printerModel = ref('');
  let printerList = ref([]);
  let config = ref();
  const checkStatus = ref(false);

  // get all list printer on client side
  async function getPrinter() {
    printerList.value = [];
    websocketConnection().then(async function () {
      await qz.printers.details().then((v) => {
        printerList.value = v;
        if (!printerModel.value) {
          v.forEach((r) => {
            if (r.default) {
              printerModel.value = r.name;
            }
          });
        }
        return;
      });
    });
  }

  // connect to printer set by default "POS80 Printer"
  async function connectPrinter() {
    if (!checkStatusConnect()) {
      getPrinter().then(function () {
        return qz.printers.find(printerModel.value); // Pass the printer name into the next Promise
      });
    }
  }

  // connect to websocket
  async function websocketConnection() {
    checkStatus.value = true;

    qz.security.setCertificatePromise(function (resolve, reject) {
      resolve(
        '-----BEGIN CERTIFICATE-----\n' +
          'MIIFAzCCAuugAwIBAgICEAIwDQYJKoZIhvcNAQEFBQAwgZgxCzAJBgNVBAYTAlVT\n' +
          'MQswCQYDVQQIDAJOWTEbMBkGA1UECgwSUVogSW5kdXN0cmllcywgTExDMRswGQYD\n' +
          'VQQLDBJRWiBJbmR1c3RyaWVzLCBMTEMxGTAXBgNVBAMMEHF6aW5kdXN0cmllcy5j\n' +
          'b20xJzAlBgkqhkiG9w0BCQEWGHN1cHBvcnRAcXppbmR1c3RyaWVzLmNvbTAeFw0x\n' +
          'NTAzMTkwMjM4NDVaFw0yNTAzMTkwMjM4NDVaMHMxCzAJBgNVBAYTAkFBMRMwEQYD\n' +
          'VQQIDApTb21lIFN0YXRlMQ0wCwYDVQQKDAREZW1vMQ0wCwYDVQQLDAREZW1vMRIw\n' +
          'EAYDVQQDDAlsb2NhbGhvc3QxHTAbBgkqhkiG9w0BCQEWDnJvb3RAbG9jYWxob3N0\n' +
          'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtFzbBDRTDHHmlSVQLqjY\n' +
          'aoGax7ql3XgRGdhZlNEJPZDs5482ty34J4sI2ZK2yC8YkZ/x+WCSveUgDQIVJ8oK\n' +
          'D4jtAPxqHnfSr9RAbvB1GQoiYLxhfxEp/+zfB9dBKDTRZR2nJm/mMsavY2DnSzLp\n' +
          't7PJOjt3BdtISRtGMRsWmRHRfy882msBxsYug22odnT1OdaJQ54bWJT5iJnceBV2\n' +
          '1oOqWSg5hU1MupZRxxHbzI61EpTLlxXJQ7YNSwwiDzjaxGrufxc4eZnzGQ1A8h1u\n' +
          'jTaG84S1MWvG7BfcPLW+sya+PkrQWMOCIgXrQnAsUgqQrgxQ8Ocq3G4X9UvBy5VR\n' +
          'CwIDAQABo3sweTAJBgNVHRMEAjAAMCwGCWCGSAGG+EIBDQQfFh1PcGVuU1NMIEdl\n' +
          'bmVyYXRlZCBDZXJ0aWZpY2F0ZTAdBgNVHQ4EFgQUpG420UhvfwAFMr+8vf3pJunQ\n' +
          'gH4wHwYDVR0jBBgwFoAUkKZQt4TUuepf8gWEE3hF6Kl1VFwwDQYJKoZIhvcNAQEF\n' +
          'BQADggIBAFXr6G1g7yYVHg6uGfh1nK2jhpKBAOA+OtZQLNHYlBgoAuRRNWdE9/v4\n' +
          'J/3Jeid2DAyihm2j92qsQJXkyxBgdTLG+ncILlRElXvG7IrOh3tq/TttdzLcMjaR\n' +
          '8w/AkVDLNL0z35shNXih2F9JlbNRGqbVhC7qZl+V1BITfx6mGc4ayke7C9Hm57X0\n' +
          'ak/NerAC/QXNs/bF17b+zsUt2ja5NVS8dDSC4JAkM1dD64Y26leYbPybB+FgOxFu\n' +
          'wou9gFxzwbdGLCGboi0lNLjEysHJBi90KjPUETbzMmoilHNJXw7egIo8yS5eq8RH\n' +
          'i2lS0GsQjYFMvplNVMATDXUPm9MKpCbZ7IlJ5eekhWqvErddcHbzCuUBkDZ7wX/j\n' +
          'unk/3DyXdTsSGuZk3/fLEsc4/YTujpAjVXiA1LCooQJ7SmNOpUa66TPz9O7Ufkng\n' +
          '+CoTSACmnlHdP7U9WLr5TYnmL9eoHwtb0hwENe1oFC5zClJoSX/7DRexSJfB7YBf\n' +
          'vn6JA2xy4C6PqximyCPisErNp85GUcZfo33Np1aywFv9H+a83rSUcV6kpE/jAZio\n' +
          '5qLpgIOisArj1HTM6goDWzKhLiR/AeG3IJvgbpr9Gr7uZmfFyQzUjvkJ9cybZRd+\n' +
          'G8azmpBBotmKsbtbAU/I/LVk8saeXznshOVVpDRYtVnjZeAneso7\n' +
          '-----END CERTIFICATE-----\n' +
          '--START INTERMEDIATE CERT--\n' +
          '-----BEGIN CERTIFICATE-----\n' +
          'MIIFEjCCA/qgAwIBAgICEAAwDQYJKoZIhvcNAQELBQAwgawxCzAJBgNVBAYTAlVT\n' +
          'MQswCQYDVQQIDAJOWTESMBAGA1UEBwwJQ2FuYXN0b3RhMRswGQYDVQQKDBJRWiBJ\n' +
          'bmR1c3RyaWVzLCBMTEMxGzAZBgNVBAsMElFaIEluZHVzdHJpZXMsIExMQzEZMBcG\n' +
          'A1UEAwwQcXppbmR1c3RyaWVzLmNvbTEnMCUGCSqGSIb3DQEJARYYc3VwcG9ydEBx\n' +
          'emluZHVzdHJpZXMuY29tMB4XDTE1MDMwMjAwNTAxOFoXDTM1MDMwMjAwNTAxOFow\n' +
          'gZgxCzAJBgNVBAYTAlVTMQswCQYDVQQIDAJOWTEbMBkGA1UECgwSUVogSW5kdXN0\n' +
          'cmllcywgTExDMRswGQYDVQQLDBJRWiBJbmR1c3RyaWVzLCBMTEMxGTAXBgNVBAMM\n' +
          'EHF6aW5kdXN0cmllcy5jb20xJzAlBgkqhkiG9w0BCQEWGHN1cHBvcnRAcXppbmR1\n' +
          'c3RyaWVzLmNvbTCCAiIwDQYJKoZIhvcNAQEBBQADggIPADCCAgoCggIBANTDgNLU\n' +
          'iohl/rQoZ2bTMHVEk1mA020LYhgfWjO0+GsLlbg5SvWVFWkv4ZgffuVRXLHrwz1H\n' +
          'YpMyo+Zh8ksJF9ssJWCwQGO5ciM6dmoryyB0VZHGY1blewdMuxieXP7Kr6XD3GRM\n' +
          'GAhEwTxjUzI3ksuRunX4IcnRXKYkg5pjs4nLEhXtIZWDLiXPUsyUAEq1U1qdL1AH\n' +
          'EtdK/L3zLATnhPB6ZiM+HzNG4aAPynSA38fpeeZ4R0tINMpFThwNgGUsxYKsP9kh\n' +
          '0gxGl8YHL6ZzC7BC8FXIB/0Wteng0+XLAVto56Pyxt7BdxtNVuVNNXgkCi9tMqVX\n' +
          'xOk3oIvODDt0UoQUZ/umUuoMuOLekYUpZVk4utCqXXlB4mVfS5/zWB6nVxFX8Io1\n' +
          '9FOiDLTwZVtBmzmeikzb6o1QLp9F2TAvlf8+DIGDOo0DpPQUtOUyLPCh5hBaDGFE\n' +
          'ZhE56qPCBiQIc4T2klWX/80C5NZnd/tJNxjyUyk7bjdDzhzT10CGRAsqxAnsjvMD\n' +
          '2KcMf3oXN4PNgyfpbfq2ipxJ1u777Gpbzyf0xoKwH9FYigmqfRH2N2pEdiYawKrX\n' +
          '6pyXzGM4cvQ5X1Yxf2x/+xdTLdVaLnZgwrdqwFYmDejGAldXlYDl3jbBHVM1v+uY\n' +
          '5ItGTjk+3vLrxmvGy5XFVG+8fF/xaVfo5TW5AgMBAAGjUDBOMB0GA1UdDgQWBBSQ\n' +
          'plC3hNS56l/yBYQTeEXoqXVUXDAfBgNVHSMEGDAWgBQDRcZNwPqOqQvagw9BpW0S\n' +
          'BkOpXjAMBgNVHRMEBTADAQH/MA0GCSqGSIb3DQEBCwUAA4IBAQAJIO8SiNr9jpLQ\n' +
          'eUsFUmbueoxyI5L+P5eV92ceVOJ2tAlBA13vzF1NWlpSlrMmQcVUE/K4D01qtr0k\n' +
          'gDs6LUHvj2XXLpyEogitbBgipkQpwCTJVfC9bWYBwEotC7Y8mVjjEV7uXAT71GKT\n' +
          'x8XlB9maf+BTZGgyoulA5pTYJ++7s/xX9gzSWCa+eXGcjguBtYYXaAjjAqFGRAvu\n' +
          'pz1yrDWcA6H94HeErJKUXBakS0Jm/V33JDuVXY+aZ8EQi2kV82aZbNdXll/R6iGw\n' +
          '2ur4rDErnHsiphBgZB71C5FD4cdfSONTsYxmPmyUb5T+KLUouxZ9B0Wh28ucc1Lp\n' +
          'rbO7BnjW\n' +
          '-----END CERTIFICATE-----\n',
      );
    });

    return qz.websocket.connect();
  }

  // disconnect printer
  function disconnectPrinter() {
    qz.websocket
      .disconnect()
      .then(() => {
        checkStatus.value = false;
        // // console.log('Disconnected successfully');
      })
      .catch((e) => {
        // // console.log(e);
      });
  }

  // check printer status connection
  function checkStatusConnect() {
    return qz.websocket.isActive();
  }

  var link = document.getElementsByTagName('link');

  for (let i = 0; i < link.length; i++) {
    link[i].href = link[i].href;
  }

  function executePrint() {
    // init data for html pixel print
    var data = [
      {
        type: 'pixel',
        format: 'html',
        flavor: 'plain',
        data: document.documentElement.innerHTML,
      },
    ];

    const options = {
      scaleContent: false,
    };

    // it will running if connection websocket is true
    connectPrinter()
      .then(() => {
        config.value = qz.configs.create(printerModel.value, options); // Create a default config for the found printer
      })
      .then(async () => {
        if (checkStatusConnect()) {
          await qz.print(config.value, data);
        }
      })
      .catch((e) => {
        messageInfo('Permintaan ditolak!');
        console.error(e);
      })
      .finally(() => {
        // disconnectPrinter();
        // // console.log(`Proceed to ${printerModel.value}`);
      });
  }

  const fn = { getPrinter, executePrint };

  return [fn, printerModel, printerList, checkStatus];
}
/* alt + shift + a */
