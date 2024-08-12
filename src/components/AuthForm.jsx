import React from 'react';
import { FormProvider, useFormContext } from 'react-hook-form';
import { Form, FormField, FormItem, FormLabel, Select, Button, CardContent, CardFooter, Card } from '@/components/ui';
import { handleGoogleSignIn } from './handleGoogleSignIn'; // Import the handleGoogleSignIn function

const AuthForm = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useFormContext();
  const [isLogin, setIsLogin] = React.useState(true); // Define the isLogin state
  const [loading, setLoading] = React.useState(false); // Define the loading state

  const onSubmit = async (data) => {
    // Handle form submission
  };

return (  
    <Card>
      <CardContent>
        <FormProvider>
          <Form onSubmit={handleSubmit(onSubmit)}>
            {/* ... (rest of the form fields) */}
            {!isLogin && (
              <FormField
                name="userType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User Type</FormLabel>
                    <Select
                      id="userType"
                      value={field.value}
                      onChange={field.onChange}
                      defaultValue="free" // Set a default value
                    >
                      <SelectTrigger>
                        <SelectValue />import React from 'react';
                        import { FormProvider, useFormContext } from 'react-hook-form';
                        import { 
                          Form, 
                          FormField, 
                          FormItem, 
                          FormLabel, 
                          Select, 
                          SelectTrigger, 
                          SelectValue, 
                          SelectContent, 
                          SelectItem, 
                          Button, 
                          CardContent, 
                          CardFooter, 
                          Card 
                        } from '@/components/ui';
                        
                        const AuthForm = () => {
                          const { register, handleSubmit, formState: { errors, isSubmitting } } = useFormContext();
                          const [isLogin, setIsLogin] = React.useState(true); 
                          const [loading, setLoading] = React.useState(false); 
                        
                          const onSubmit = async (data) => {
                            // Handle form submission
                          };
                        
                          return (
                            <Card>
                              <CardContent>
                                <FormProvider>
                                  <Form onSubmit={handleSubmit(onSubmit)}>
                                    {/* ... (rest of the form fields) */}
                                    {!isLogin && (
                                      <FormField
                                        name="userType"
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>User Type</FormLabel>
                                            <Select
                                              id="userType"
                                              value={field.value}
                                              onChange={field.onChange}
                                              defaultValue="free" 
                                            >
                                              <SelectTrigger>
                                                <SelectValue />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="free">Free</SelectItem>
                                                <SelectItem value="pro">Pro</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </FormItem>
                                        )}
                                      />
                                    )}
                                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                                      {isSubmitting ? "Processing..." : (isLogin ? "Login" : "Sign Up")}
                                    </Button>
                                  </Form>
                                </FormProvider>
                              </CardContent>
                              <CardFooter>
                                <Button variant="outline" className="w-full" disabled={isSubmitting}>
                                  Sign in with Google
                                </Button>
                              </CardFooter>
                            </Card>
                          );
                        };
                        
                        export default AuthForm;
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="free">Free</SelectItem>
                        <SelectItem value="pro">Pro</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            )}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : (isLogin ? "Login" : "Sign Up")}
            </Button>
          </Form>
        </FormProvider>
      </CardContent>
      <CardFooter>
        <Button variant="outline" onClick={handleGoogleSignIn} className="w-full" disabled={isSubmitting}>
          Sign in with Google
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AuthForm;