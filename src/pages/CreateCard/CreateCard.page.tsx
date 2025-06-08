import { Button, Label, TextInput, Textarea, Spinner } from "flowbite-react";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { TRootState } from "../../store/store";
import axios from "axios";
import { toast } from "react-toastify";

type CardFormData = {
  title: string;
  subtitle: string;
  description: string;
  phone: string; 
  email: string;
  web: string;
  image: {
    url: string;
    alt: string;
  };
  address: {
    country: string;
    city: string;
    street: string;
    houseNumber: number;
  };
  // These will be auto-filled
  bizNumber?: number;
  user_id?: string;
};

const CreateCard = () => {
  const [formData, setFormData] = useState<CardFormData>({
    title: "",
    subtitle: "",
    description: "",
    phone: "",
    email: "",
    web: "",
    image: {
      url: "",
      alt: ""
    },
    address: {
      country: "",
      city: "",
      street: "",
      houseNumber: 0
    }
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const user = useSelector((state: TRootState) => state.userSlice.user);
  
  useEffect(() => {
    if (!user) {
      toast.error("You must be logged in to create cards");
      navigate("/");
    }
  }, [user, navigate]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.subtitle.trim()) newErrors.subtitle = "Subtitle is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!/^\+?(\d[\d-. ]+)?(\([\d-. ]+\))?(\d[\d-. ]+)\d$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone format";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (formData.web && !/^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/.test(formData.web)) {
      newErrors.web = "Invalid URL format";
    }
    
    if (!formData.image.url) {
      newErrors["image.url"] = "Image URL is required";
    }
    
    if (!formData.address.country) {
      newErrors["address.country"] = "Country is required";
    }
    
    if (!formData.address.city) {
      newErrors["address.city"] = "City is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  useEffect(() => {
    validateForm();
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle nested objects (address and image)
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...((prev[parent as keyof typeof prev] as object) || {}),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  // Check if form is valid
  const isFormValid = useMemo(() => {
    // Basic required fields
    if (!formData.title.trim() || !formData.subtitle.trim() || !formData.description.trim() ||
        !formData.phone.trim() || !formData.email.trim() || !formData.image.url ||
        !formData.address.country || !formData.address.city) {
      return false;
    }
    
    // Valid email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return false;
    }
    
    // Valid phone format
    if (!/^\+?(\d[\d-. ]+)?(\([\d-. ]+\))?(\d[\d-. ]+)\d$/.test(formData.phone)) {
      return false;
    }
    
    // Valid URL format if provided
    if (formData.web && !/^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/.test(formData.web)) {
      return false;
    }
    
    // Check if there are any errors
    return Object.keys(errors).length === 0;
  }, [formData, errors]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) {
      toast.error("Please fix the form errors before submitting");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication error. Please log in again.");
        return;
      }
      

      const cardData = {
        title: formData.title,
        subtitle: formData.subtitle,
        description: formData.description,
        web: formData.web,
        email: formData.email,
        image: {
          url: formData.image.url,
          alt: formData.image.alt || formData.title // Set alt text to title if not provided
        },
        phone: Number(formData.phone), // Convert phone to number
        address: {
          country: formData.address.country,
          city: formData.address.city,
          street: formData.address.street,
          houseNumber: Number(formData.address.houseNumber) // Ensure houseNumber is a number
        },
        bizNumber: Math.floor(Math.random() * 10000000), // Random business number
        user_id: user?._id, // Set user ID from redux store
      };
      

      const response = await axios.post(
        "https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards",
        cardData,
        {
          headers: {
            "x-auth-token": token
          }
        }
      );
      
      toast.success("Card created successfully!");
      console.log("Card created:", response.data);
      navigate(`/card/${response.data._id}`);
    } catch (error) {
      console.error("Error creating card:", error);
      toast.error("Failed to create card. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-16 dark:bg-gray-800">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="mb-8 text-center text-3xl font-bold text-gray-800 dark:text-white">
          Create New Business Card
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6 rounded-lg bg-gray-50 p-6 shadow-md dark:bg-gray-700">
          <div>
            <div className="mb-6">
              <Label htmlFor="title" value="Business Name *" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white" />
              <TextInput
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter business name"
                required
                color={errors.title ? "failure" : undefined}
                helperText={errors.title}
              />
            </div>
            
            <div className="mb-6">
              <Label htmlFor="subtitle" value="Business Subtitle *" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white" />
              <TextInput
                id="subtitle"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                placeholder="Enter subtitle or tagline"
                required
                color={errors.subtitle ? "failure" : undefined}
                helperText={errors.subtitle}
              />
            </div>
            
            <div className="mb-6">
              <Label htmlFor="description" value="Description *" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white" />
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your business"
                required
                rows={3}
                className={`block w-full rounded-lg border ${errors.description ? 'border-red-500' : 'border-gray-300'} bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-purple-500 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-purple-500 dark:focus:ring-purple-500`}
              />
              {errors.description && <p className="mt-2 text-sm text-red-600">{errors.description}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="phone" value="Phone Number *" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white" />
              <TextInput
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                required
                color={errors.phone ? "failure" : undefined}
                helperText={errors.phone}
              />
            </div>
            
            <div>
              <Label htmlFor="email" value="Email Address *" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white" />
              <TextInput
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                required
                color={errors.email ? "failure" : undefined}
                helperText={errors.email}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="web" value="Website" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white" />
              <TextInput
                id="web"
                name="web"
                type="url"
                value={formData.web}
                onChange={handleChange}
                placeholder="https://example.com"
                color={errors.web ? "failure" : undefined}
                helperText={errors.web}
              />
            </div>
            
            <div>
              <Label htmlFor="image.url" value="Image URL *" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white" />
              <TextInput
                id="image.url"
                name="image.url"
                type="url"
                value={formData.image.url}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="image.alt" value="Image Alt Text" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white" />
              <TextInput
                id="image.alt"
                name="image.alt"
                value={formData.image.alt}
                onChange={handleChange}
                placeholder="Image description"
              />
            </div>
          </div>

          <h3 className="mt-6 mb-4 text-xl font-semibold text-gray-800 dark:text-white">Address Information</h3>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="address.country" value="Country *" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white" />
              <TextInput
                id="address.country"
                name="address.country"
                value={formData.address.country}
                onChange={handleChange}
                placeholder="Country"
              />
            </div>
            
            <div>
              <Label htmlFor="address.city" value="City *" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white" />
              <TextInput
                id="address.city"
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
                placeholder="City"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="address.street" value="Street" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white" />
              <TextInput
                id="address.street"
                name="address.street"
                value={formData.address.street}
                onChange={handleChange}
                placeholder="Street name"
              />
            </div>
            
            <div>
              <Label htmlFor="address.houseNumber" value="House Number" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white" />
              <TextInput
                id="address.houseNumber"
                name="address.houseNumber"
                type="number"
                value={formData.address.houseNumber}
                onChange={handleChange}
                placeholder="House number"
              />
            </div>
          </div>
          
          <div className="mt-8 flex justify-center">
            <Button
              type="submit"
              gradientDuoTone="purpleToPink"
              className="px-8"
              disabled={isSubmitting || !isFormValid}
            >
              {isSubmitting ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Creating...
                </>
              ) : (
                "Create Card"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCard;
