/** Build-time QR codes as inline SVG (brand ink on white). */
import QRCode from 'qrcode';

export async function qrSvg(url: string): Promise<string> {
  return QRCode.toString(url, {
    type: 'svg',
    margin: 0,
    errorCorrectionLevel: 'M',
    color: { dark: '#1A1420', light: '#FFFFFF' },
  });
}
