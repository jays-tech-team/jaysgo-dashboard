const RequiredStar: React.FC<{ required: boolean }> = ({ required }) =>
  required ? (
    <span className="text-red-500" aria-label="required">
      *
    </span>
  ) : null;

export default RequiredStar;
