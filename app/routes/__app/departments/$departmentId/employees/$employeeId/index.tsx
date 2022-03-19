import * as React from "react";

const Header: React.FC<{ caption: string }> = ({ caption, children }) => {
  return (
    <div className="border-b-2 border-sky-500">
      <p className="ml-1">{children}</p>
    </div>
  );
};

export default function Employee() {
  return (
    <div className="p-2">
      <Header caption={""}>Aanwezigheid</Header>
    </div>
  );
}
