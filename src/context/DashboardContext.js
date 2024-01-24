const { createContext, useContext } = require("react");

export const LoadingContext = createContext({
  isLoading: false,
  setLoading: () => {},
});

export const useLoadingContext = () => {
  const context = useContext(LoadingContext);

  if (typeof context === "undefined") {
    throw new Error(
      "useLoadingContext should be used within the SidebarContext provider!",
    );
  }

  return context;
};
