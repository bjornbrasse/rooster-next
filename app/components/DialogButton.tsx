import * as React from "react";
import { useDialog } from "~/contexts/dialog";

const DialogButton: React.FC<{
  description: string;
  form: React.ReactNode;
  icon: string;
  title: string;
}> = ({ description, form, icon, title }) => {
  const { openDialog } = useDialog();

  return (
    <button
      onClick={() => openDialog(title, form, description)}
      className="btn btn-save"
    >
      <i className={`${icon}`} />
    </button>
  );
};

export default DialogButton;
