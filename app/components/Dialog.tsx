import * as React from 'react';
import { createPortal } from 'react-dom';
import { Dialog } from '@headlessui/react';

export interface DialogProperties {
  description?: string;
  form: React.ReactNode;
  title: string;
}

interface IProps {
  dialogProperties: DialogProperties;
  showDialog: boolean;
  showDialogHandler: (showDialog: boolean) => void;
}

const DialogComponent: React.FC<IProps> = ({
  children,
  dialogProperties,
  showDialog,
  showDialogHandler,
}) => {
  return (
    <>
      {typeof window === 'object' &&
        showDialog &&
        createPortal(
          <Dialog
            open={showDialog}
            onClose={() => showDialogHandler(false)}
            as="div"
            className="fixed inset-0 z-10 overflow-y-auto"
          >
            <Dialog.Overlay className="fixed inset-0 z-50 flex justify-center items-center bg-gray-700 bg-opacity-60">
              <div
                onClick={(e) => e.stopPropagation()}
                className="relative w-1/2 p-3 bg-white border border-gray-300 rounded-lg "
              >
                <button
                  onClick={showDialogHandler.bind(this, false)}
                  className="absolute -top-4 -right-4 w-8 h-8 bg-indigo-600 text-white font-bold rounded-full"
                >
                  X
                </button>
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  {dialogProperties.title}
                </Dialog.Title>
                <Dialog.Description className="mb-4">
                  {dialogProperties.description}
                </Dialog.Description>
                {children}

                <div className="mt-4">
                  <button onClick={() => showDialogHandler(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            </Dialog.Overlay>
          </Dialog>,
          document.getElementById('dialog') as Element
        )}
    </>
  );
};

export default DialogComponent;
