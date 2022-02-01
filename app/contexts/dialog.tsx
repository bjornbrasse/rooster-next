import * as React from 'react';
import Dialog, { DialogProperties } from '~/components/Dialog';

type TDialogContext = {
  closeDialog: () => void;
  openDialog: (
    title: string,
    form: React.ReactNode,
    description?: string
  ) => void;
};

const DialogContext = React.createContext<TDialogContext>({
  openDialog() {},
  closeDialog() {},
});

export const useDialog = () => {
  return React.useContext(DialogContext);
};

export const DialogProvider = ({
  children,
}: {
  children: React.ReactElement;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const [dialogProperties, setDialogProperties] =
    React.useState<DialogProperties>({
      title: '',
      form: null,
      description: '',
    });

  const openDialog = (
    title: string,
    form: React.ReactNode,
    description?: string
  ) => {
    setDialogProperties({ description, form, title });
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };

  return (
    <DialogContext.Provider
      value={{
        closeDialog,
        openDialog,
      }}
    >
      {children}
      <Dialog
        dialogProperties={dialogProperties}
        showDialog={isOpen}
        showDialogHandler={(showDialog: boolean) => {
          if (!showDialog) {
            setIsOpen(false);
          }
        }}
      >
        {dialogProperties.form}
      </Dialog>
    </DialogContext.Provider>
  );
};
