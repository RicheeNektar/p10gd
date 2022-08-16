import QRCodeStyling, { Options } from 'qr-code-styling';
import React, { Fragment, MutableRefObject, useEffect, useRef } from 'react';

type Props = {
  value: string;
  qrCodeStyle?: Options;
};

const QRCode = ({ value, qrCodeStyle }: Props) => {
  const ref = useRef();

  const styling = new QRCodeStyling({
    cornersDotOptions: {
      type: 'dot',
      color: '#6c757d',
    },
    cornersSquareOptions: {
      type: 'extra-rounded',
      color: '#6c757d',
    },
    dotsOptions: {
      type: 'rounded',
      color: '#0d6efd',
    },
    image: '/images/p10gd.jpg',
    imageOptions: {
      imageSize: .3,
      margin: 8,
    },
    data: value,
    ...qrCodeStyle,
  });

  useEffect(() => {
    styling.append(ref.current);
  }, []);

  useEffect(() => {
    styling.update({
      data: value,
    });
  }, [value]);

  return <div ref={ref}></div>;
};

export default QRCode;
