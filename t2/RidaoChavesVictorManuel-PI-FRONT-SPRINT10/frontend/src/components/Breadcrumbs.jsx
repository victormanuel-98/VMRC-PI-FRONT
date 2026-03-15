import { useNavigate } from 'react-router-dom';

const Breadcrumbs = ({ items }) => {
  const navigate = useNavigate();

  return (
    <nav className="breadcrumbs">
      <div className="breadcrumbs-container">
        {items.map((item, index) => (
          <span key={index} className="breadcrumb-item">
            {index < items.length - 1 ? (
              <>
                <button
                  onClick={() => navigate(item.path)}
                  className="breadcrumb-link"
                >
                  {item.label}
                </button>
                <span className="breadcrumb-separator">/</span>
              </>
            ) : (
              <span className="breadcrumb-current">{item.label}</span>
            )}
          </span>
        ))}
      </div>
    </nav>
  );
};

export default Breadcrumbs;
