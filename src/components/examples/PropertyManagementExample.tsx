import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePropertyActions } from '@/hooks/usePropertyActions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Edit } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';
import type { NewPropertyForm } from '@/types/property';

type PropertyRow = Tables<'properties'>;

/**
 * Complete Example: Property Management Component
 * This demonstrates all the key patterns for working with the auth system:
 * 1. Conditional UI based on roles
 * 2. Creating properties with proper user_id assignment
 * 3. Deleting properties with RLS enforcement
 * 4. Fetching user-specific or all properties based on permissions
 */
export function PropertyManagementExample() {
  const { user, isAdmin, isSeller } = useAuth();
  const { 
    handleCreateProperty, 
    handleDeleteProperty, 
    fetchUserProperties,
    canCreateProperty,
    canManageAllProperties 
  } = usePropertyActions();

  const [properties, setProperties] = useState<PropertyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  
  // Form state for creating new property
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    city: '',
    property_type: 'apartment'
  });

  // Load properties on component mount
  useEffect(() => {
    loadProperties();
  }, [user]);

  const loadProperties = async () => {
    setLoading(true);
    const { data, error } = await fetchUserProperties();
    
    if (error) {
      console.error('Error loading properties:', error);
    } else {
      setProperties(data);
    }
    setLoading(false);
  };

  const onCreateProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    // Create a properly formatted NewPropertyForm object
    const propertyData: NewPropertyForm = {
      title_ar: formData.title,
      title_en: formData.title,
      title_tr: formData.title,
      description_ar: formData.description,
      description_en: formData.description,
      description_tr: formData.description,
      price: formData.price,
      currency: 'EUR',
      deposit: '0',
      deposit_currency: 'EUR',
      commission: '0',
      commission_currency: 'EUR',
      city: formData.city,
      district: '',
      property_type: formData.property_type,
      property_layout_id: '',
      listing_type: 'rent',
      bedrooms: '0',
      bathrooms: '0',
      area: '0',
      status: 'available',
      images: [],
      cover_image: '',
      is_featured: false,
      is_student_housing: false,
      student_housing_gender: 'unspecified'
    };

    const success = await handleCreateProperty(propertyData);

    if (success) {
      alert('Property created successfully!');
      setFormData({ title: '', description: '', price: '', city: '', property_type: 'apartment' });
      loadProperties(); // Refresh the list
    } else {
      alert('Error creating property');
    }
    setCreating(false);
  };

  const onDeleteProperty = async (propertyId: string, propertyTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${propertyTitle}"?`)) {
      return;
    }

    const { error } = await handleDeleteProperty(propertyId);

    if (error) {
      alert(`Error deleting property: ${error.message}`);
    } else {
      alert('Property deleted successfully!');
      loadProperties(); // Refresh the list
    }
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <p>Please log in to manage properties.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Property Management</h1>
          <p className="text-gray-600">
            {canManageAllProperties 
              ? 'You can manage all properties (Admin)'
              : isSeller 
                ? 'You can manage your own properties (Seller)'
                : 'View-only access'
            }
          </p>
        </div>
      </div>

      {/* Create Property Form - Only show if user can create properties */}
      {canCreateProperty && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Create New Property
            </CardTitle>
            <CardDescription>
              Add a new property listing. The property will be automatically assigned to your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onCreateProperty} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Beautiful 2-bedroom apartment"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Price (EUR)</label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="1200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">City</label>
                  <Input
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="Berlin"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Property Type</label>
                  <select 
                    value={formData.property_type}
                    onChange={(e) => setFormData(prev => ({ ...prev, property_type: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="studio">Studio</option>
                    <option value="room">Room</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the property features, location, amenities..."
                  rows={3}
                />
              </div>
              <Button type="submit" disabled={creating}>
                {creating ? 'Creating...' : 'Create Property'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Properties List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {canManageAllProperties ? 'All Properties' : 'Your Properties'}
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({properties.length} properties)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-2">Loading properties...</p>
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No properties found.</p>
              {canCreateProperty && <p>Create your first property using the form above.</p>}
            </div>
          ) : (
            <div className="grid gap-4">
              {properties.map((property) => (
                <div key={property.id} className="border rounded-lg p-4 flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{property.title}</h3>
                    <p className="text-gray-600 mt-1">{property.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span>€{property.price}/month</span>
                      <span>{property.city}</span>
                      <span className="capitalize">{property.property_type}</span>
                      <span className="capitalize">{property.status}</span>
                    </div>
                    {canManageAllProperties && (
                      <p className="text-xs text-gray-400 mt-1">
                        Owner: {property.owner_name || 'Unknown'}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Show delete button if user can manage this property */}
                    {(canManageAllProperties || property.user_id === user?.id) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDeleteProperty(property.id, property.title || 'Untitled')}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
