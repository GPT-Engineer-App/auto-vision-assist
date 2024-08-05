const App = () => {
  const [isPro, setIsPro] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setIsPro(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <TooltipProvider>
          <Toaster />
          <Router>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Layout user={user} isPro={isPro} setIsPro={setIsPro} />}>
                  {navItems.map((item) => (
                    <Route 
                      key={item.to} 
                      path={item.to} 
                      element={React.cloneElement(item.page, { isPro, setIsPro, user })}
                    />
                  ))}
                  <Route path="/profile" element={<UserProfile isPro={isPro} setIsPro={setIsPro} user={user} />} />
                  <Route path="/range-finder/:dtc" element={<RangeFinder isPro={isPro} />} />
                </Route>
              </Routes>
            </AnimatePresence>
          </Router>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};
