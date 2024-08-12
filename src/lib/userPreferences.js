export const savePreferences = (preferences) => {
  localStorage.setItem('userPreferences', JSON.stringify(preferences));
};

export const loadPreferences = () => {
  const preferences = localStorage.getItem('userPreferences');
  return preferences ? JSON.parse(preferences) : null;
};
