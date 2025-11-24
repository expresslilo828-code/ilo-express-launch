import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Service } from "@/types/database";

const AdminServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    const { data, error } = await (supabase as any)
      .from("services")
      .select("*")
      .order("title", { ascending: true });

    if (error) {
      toast.error("Failed to load services");
    } else {
      setServices(data || []);
    }
    setLoading(false);
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    const { error } = await (supabase as any)
      .from("services")
      .update({ is_active: !isActive })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update service");
    } else {
      toast.success("Service updated successfully");
      fetchServices();
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">Service Management</CardTitle>
            <Button>Add New Service</Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{service.title}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {service.short_description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{service.category}</TableCell>
                    <TableCell>
                      {service.price ? `$${service.price}` : "Contact for pricing"}
                    </TableCell>
                    <TableCell>
                      {service.duration_hours ? `${service.duration_hours}h` : "N/A"}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={service.is_active}
                        onCheckedChange={() => toggleActive(service.id, service.is_active)}
                      />
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminServices;
