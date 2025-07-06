
import { Property } from "@/types/property";
import PropertyPriceCard from "./PropertyPriceCard";
import PropertyContactButtons from "./PropertyContactButtons";
import PropertyTypeCard from "./PropertyTypeCard";
import PropertyOwnerInfo from "./PropertyOwnerInfo";

interface PropertySidebarProps {
  property: Property;
  getCurrencySymbol: (currency: string) => string;
}

const PropertySidebar = ({ property, getCurrencySymbol }: PropertySidebarProps) => {
  return (
    <div className="space-y-6">
      {/* Price Card */}
      <PropertyPriceCard property={property} getCurrencySymbol={getCurrencySymbol} />

      {/* Owner Info */}
      <PropertyOwnerInfo
        ownerId={property.created_by}
        ownerName={property.owner_name || ''}
        ownerAvatar={property.owner_avatar_url}
        userType="property_owner"
        phone={property.owner_whatsapp}
        whatsapp={property.owner_whatsapp}
        email={property.owner_email}
      />

      {/* Contact Buttons - Always visible for everyone */}
      <PropertyContactButtons 
        propertyId={property.id} 
        ownerId={property.created_by} 
      />

      {/* Property Type */}
      <PropertyTypeCard property={property} />
    </div>
  );
};

export default PropertySidebar;
