import React, { useEffect } from 'react';
import Modal from 'react-modal';

interface LocationDetailsModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  contentLabel: string;
  children: React.ReactNode;
}

const LocationDetailsModal: React.FC<LocationDetailsModalProps> = ({
  isOpen,
  onRequestClose,
  contentLabel,
  children,
}) => {
  useEffect(() => {
    Modal.setAppElement('body');
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel={contentLabel}
      className='fixed inset-0 flex items-center justify-center p-4 z-1000'
      overlayClassName='fixed inset-0 bg-gray-800 bg-opacity-75 z-40'
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000,
          background: 'black',
        },
        overlay: { zIndex: 1000 },
      }}
    >
      <div className='bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 max-w-lg w-full z-50'>
        {children}
      </div>
    </Modal>
  );
};

export default LocationDetailsModal;
