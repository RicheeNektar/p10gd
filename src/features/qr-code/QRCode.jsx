import React, { Fragment } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { useRef } from 'react';
import { useEffect } from 'react';

const style = new QRCodeStyling({
  height: 1024,
  width: 1024,
  dotsOptions: {
    type: 'rounded',
    color: '#fff',
    gradient: {
      type: 'linear',
      rotation: Math.PI / 4.0,
      colorStops: [
        {
          color: '#f00',
          offset: 0,
        },
        {
          color: '#00b296',
          offset: 1,
        },
      ],
    },
  },
  cornersDotOptions: {
    type: 'dot',
    color: '#007f6b',
  },
  cornersSquareOptions: {
    type: 'extra-rounded',
    color: '#007f6b',
  },
});

const QRCode = ({ className, value }) => {
  const ref = useRef(null);

  useEffect(() => {
    style.append(ref.current);
  }, []);

  useEffect(() => {
    style.update({
      data: value,
    });

    ref.current.children[0].style.width = "100%";
  }, [value]);

  return <div className={className} ref={ref}></div>;
};

export default QRCode;
