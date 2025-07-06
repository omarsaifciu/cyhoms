import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from "@/contexts/LanguageContext";
import { Property } from "@/types/property";
import {
  Eye,
  EyeOff,
  ExternalLink,
  Star,
  Trash2,
  Edit,
  CheckCircle,
  MapPin,
  Home,
  Bed,
  Bath,
  Square,
  Calendar,
  DollarSign,
  User,
  ImageIcon
} from "lucide-react";

interface PropertyCardProps {
  property: Property;
  onToggleStatus: (id: string, currentStatus: string) => void;
  onToggleHide?: (id: string, currentStatus: string) => void;
  onToggleSold?: (id: string, currentStatus: string) => void;
  onDelete: (id: string) => void;
  onToggleFeatured: (id: string, currentFeatured: boolean) => void;
  onOpenProperty: (id: string) => void;
  onEdit?: (property: Property) => void;
}

const PropertyCard = ({
  property,
  onToggleStatus,
  onToggleHide,
  onToggleSold,
  onDelete,
  onToggleFeatured,
  onOpenProperty,
  onEdit
}: PropertyCardProps) => {
  const { currentLanguage } = useLanguage();

  const getPropertyTitle = () => {
    if (currentLanguage === 'ar' && property.title_ar) return property.title_ar;
    if (currentLanguage === 'en' && property.title_en) return property.title_en;
    if (currentLanguage === 'tr' && property.title_tr) return property.title_tr;
    return property.title || property.title_ar || property.title_en || property.title_tr || 'No Title';
  };

  const getPropertyCoverImage = () => {
    if (property.cover_image) return property.cover_image;
    if (property.images && Array.isArray(property.images) && property.images.length > 0) {
      return property.images[0];
    }
    return null;
  };

  const getOwnerInitials = () => {
    const name = property.owner_name;
    if (!name) return 'U';
    const words = name.trim().split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return words[0][0].toUpperCase();
  };

  const handleOwnerClick = () => {
    if (property.created_by) {
      window.open(`/user/${property.created_by}`, '_blank');
    }
  };

  const getOwnerDisplayName = () => {
    return property.owner_name ||
           (currentLanguage === 'ar' ? 'مالك غير محدد' :
            currentLanguage === 'tr' ? 'Belirtilmemiş Sahip' :
            'Unknown Owner');
  };

  const getStatusBadge = () => {
    const status = property.status;
    let variant: "default" | "secondary" | "destructive" | "outline" = "default";
    let text = status;

    switch (status) {
      case 'available':
        variant = "default";
        text = currentLanguage === 'ar' ? 'متاح' : currentLanguage === 'tr' ? 'Müsait' : 'Available';
        break;
      case 'pending':
        variant = "secondary";
        text = currentLanguage === 'ar' ? 'معلق' : currentLanguage === 'tr' ? 'Beklemede' : 'Pending';
        break;
      case 'sold':
        variant = "destructive";
        text = currentLanguage === 'ar' ? 'مباع' : currentLanguage === 'tr' ? 'Satıldı' : 'Sold';
        break;
      case 'rented':
        variant = "outline";
        text = currentLanguage === 'ar' ? 'مؤجر' : currentLanguage === 'tr' ? 'Kiralandı' : 'Rented';
        break;
      case 'hidden':
        variant = "destructive";
        text = currentLanguage === 'ar' ? 'مخفي' : currentLanguage === 'tr' ? 'Gizli' : 'Hidden';
        break;
      default:
        text = status || 'Unknown';
    }

    return <Badge variant={variant}>{text}</Badge>;
  };

  const getListingTypeBadge = () => {
    const listingType = property.listing_type;
    if (!listingType) return null;

    let text = listingType;
    switch (listingType) {
      case 'for_sale':
        text = currentLanguage === 'ar' ? 'للبيع' : currentLanguage === 'tr' ? 'Satılık' : 'For Sale';
        break;
      case 'for_rent':
        text = currentLanguage === 'ar' ? 'للإيجار' : currentLanguage === 'tr' ? 'Kiralık' : 'For Rent';
        break;
    }

    return <Badge variant="outline">{text}</Badge>;
  };

  const formatPrice = () => {
    if (!property.price) return 'N/A';
    const currency = property.currency || 'EUR';
    return `${property.price.toLocaleString()} ${currency}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString(currentLanguage === 'ar' ? 'ar-EG' : currentLanguage === 'tr' ? 'tr-TR' : 'en-US');
  };

  return (
    <Card className="h-full hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Property Cover Image */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {getPropertyCoverImage() ? (
          <img
            src={getPropertyCoverImage()}
            alt={getPropertyTitle()}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <ImageIcon className="w-16 h-16 text-gray-400" />
          </div>
        )}

        {/* Status Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {getStatusBadge()}
          {getListingTypeBadge()}
        </div>

        {/* Featured Badge */}
        {property.is_featured && (
          <div className="absolute top-3 right-3">
            <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600">
              <Star className="w-3 h-3 mr-1 fill-current" />
              {currentLanguage === 'ar' ? 'مميز' : currentLanguage === 'tr' ? 'Öne Çıkan' : 'Featured'}
            </Badge>
          </div>
        )}

        {/* Hidden by Admin Badge */}
        {property.hidden_by_admin && (
          <div className="absolute bottom-3 left-3">
            <Badge variant="destructive">
              {currentLanguage === 'ar' ? 'مخفي من الأدمن' : currentLanguage === 'tr' ? 'Admin Tarafından Gizli' : 'Hidden by Admin'}
            </Badge>
          </div>
        )}
      </div>

      <CardHeader className="pb-3">
        {/* Property Title */}
        <h3 className="font-semibold text-lg line-clamp-2 mb-3">
          {getPropertyTitle()}
        </h3>

        {/* Owner Information */}
        <div
          className={`flex items-center gap-3 p-3 bg-gray-50 rounded-lg transition-colors group ${
            property.created_by ? 'hover:bg-gray-100 cursor-pointer' : ''
          }`}
          onClick={property.created_by ? handleOwnerClick : undefined}
        >
          <Avatar className="w-10 h-10 border-2 border-white shadow-sm group-hover:shadow-md transition-shadow">
            <AvatarImage src={property.owner_avatar_url || undefined} alt={getOwnerDisplayName()} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
              {getOwnerInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className={`font-medium text-sm truncate transition-colors ${
              property.created_by ? 'text-gray-900 group-hover:text-blue-600' : 'text-gray-500'
            }`}>
              {getOwnerDisplayName()}
            </p>
            <p className="text-xs text-gray-500">
              {currentLanguage === 'ar' ? 'مالك العقار' : currentLanguage === 'tr' ? 'Mülk Sahibi' : 'Property Owner'}
            </p>
          </div>
          {property.created_by && (
            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Location */}
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="truncate">{property.city || 'N/A'} {property.district && `- ${property.district}`}</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <DollarSign className="w-4 h-4 mr-2 text-green-600" />
            <span className="font-bold text-lg text-green-600">{formatPrice()}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Eye className="w-4 h-4 mr-1" />
            <span>{property.views_count || 0}</span>
          </div>
        </div>

        {/* Property Details Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center">
            <Home className="w-4 h-4 mr-2 text-muted-foreground flex-shrink-0" />
            <span className="truncate">{property.property_type || 'N/A'}</span>
          </div>

          {property.bedrooms && (
            <div className="flex items-center">
              <Bed className="w-4 h-4 mr-2 text-muted-foreground flex-shrink-0" />
              <span>{property.bedrooms} {currentLanguage === 'ar' ? 'غرف' : currentLanguage === 'tr' ? 'oda' : 'beds'}</span>
            </div>
          )}

          {property.bathrooms && (
            <div className="flex items-center">
              <Bath className="w-4 h-4 mr-2 text-muted-foreground flex-shrink-0" />
              <span>{property.bathrooms} {currentLanguage === 'ar' ? 'حمام' : currentLanguage === 'tr' ? 'banyo' : 'baths'}</span>
            </div>
          )}

          {property.area && (
            <div className="flex items-center">
              <Square className="w-4 h-4 mr-2 text-muted-foreground flex-shrink-0" />
              <span>{property.area} m²</span>
            </div>
          )}
        </div>

        {/* Created Date */}
        <div className="flex items-center text-xs text-muted-foreground pt-2 border-t">
          <Calendar className="w-3 h-3 mr-2 flex-shrink-0" />
          <span>{currentLanguage === 'ar' ? 'تاريخ الإضافة:' : currentLanguage === 'tr' ? 'Eklenme Tarihi:' : 'Created:'} {formatDate(property.created_at)}</span>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-3 border-t">
          {/* Primary Action - Open Property */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => onOpenProperty(property.id)}
            className="w-full justify-center gap-2 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
          >
            <ExternalLink className="w-4 h-4" />
            {currentLanguage === 'ar' ? 'فتح العقار' : currentLanguage === 'tr' ? 'Mülkü Aç' : 'Open Property'}
          </Button>

          {/* Secondary Actions Row */}
          <div className="flex gap-2 justify-center">
            {/* Featured Button - Golden */}
            <Button
              size="sm"
              variant={property.is_featured ? "default" : "outline"}
              onClick={() => onToggleFeatured(property.id, property.is_featured || false)}
              className={property.is_featured ?
                'bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500' :
                'hover:bg-yellow-50 hover:border-yellow-300 hover:text-yellow-700'
              }
              title={property.is_featured ?
                (currentLanguage === 'ar' ? 'إزالة من المميزة' : 'Remove from featured') :
                (currentLanguage === 'ar' ? 'إضافة إلى المميزة' : 'Add to featured')
              }
            >
              <Star className={`w-4 h-4 ${property.is_featured ? 'fill-current' : ''}`} />
            </Button>

            {/* Sold/Available Toggle Button */}
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                if (onToggleSold) {
                  onToggleSold(property.id, property.status || 'available');
                } else {
                  onToggleStatus(property.id, property.status || 'available');
                }
              }}
              className={property.status === 'sold' || property.status === 'rented' ?
                'bg-green-500 hover:bg-green-600 text-white border-green-500' :
                'hover:bg-green-50 hover:border-green-300 hover:text-green-700'
              }
              title={property.status === 'sold' || property.status === 'rented' ?
                (currentLanguage === 'ar' ? 'إعادة تعيين إلى متاح' : 'Mark as available') :
                (currentLanguage === 'ar' ? 'تحديد كمباع/مؤجر' : 'Mark as sold/rented')
              }
            >
              <CheckCircle className={`w-4 h-4 ${property.status === 'sold' || property.status === 'rented' ? 'fill-current' : ''}`} />
            </Button>

            {/* Hide/Show Toggle Button */}
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                if (onToggleHide) {
                  onToggleHide(property.id, property.status || 'available');
                } else {
                  onToggleStatus(property.id, property.status || 'available');
                }
              }}
              className={(property.status === 'hidden' || property.status === 'pending') ?
                'bg-gray-500 hover:bg-gray-600 text-white border-gray-500' :
                'hover:bg-gray-50 hover:border-gray-300'
              }
              title={(property.status === 'hidden' || property.status === 'pending') ?
                (currentLanguage === 'ar' ? 'إظهار العقار' : 'Show Property') :
                (currentLanguage === 'ar' ? 'إخفاء العقار' : 'Hide Property')
              }
            >
              {(property.status === 'hidden' || property.status === 'pending') ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* Third Row - Edit and Delete */}
          <div className="flex gap-2 justify-center">
            {/* Edit Button */}
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit && onEdit(property)}
              className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
              title={currentLanguage === 'ar' ? 'تعديل العقار' : 'Edit Property'}
            >
              <Edit className="w-4 h-4" />
            </Button>

            {/* Delete Button */}
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDelete(property.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300"
              title={currentLanguage === 'ar' ? 'حذف العقار' : 'Delete Property'}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
