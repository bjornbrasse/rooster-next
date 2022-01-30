import { Link } from 'remix';

export default function OrganisationDepartments() {
  return (
    <div className="h-full">
      <h3>Afdelingen</h3>
      <Link to="create" className="absolute top-0.5 right-2 btn btn-save">
        <i className="fas fa-plus"></i>
      </Link>
    </div>
  );
}
