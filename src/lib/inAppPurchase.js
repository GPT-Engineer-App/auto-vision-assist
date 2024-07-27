// This is a mock implementation of in-app purchase functionality
// In a real app, you would integrate with the actual Play Store billing library

let isPurchased = false;
let subscriptionType = null;
let queryCount = 0;
let rangefinderQueries = 0;

export const purchaseApp = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      isPurchased = true;
      resolve(true);
    }, 2000);
  });
};

export const purchaseSubscription = async (type) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      subscriptionType = type;
      queryCount = type === 'monthly' ? 100 : 12000;
      resolve(true);
    }, 2000);
  });
};

export const purchaseQueryPack = async (pack) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      switch(pack) {
        case '25':
          queryCount += 25;
          break;
        case '50':
          queryCount += 50;
          break;
        case '100':
          queryCount += 100;
          rangefinderQueries += 20;
          break;
        case '500':
          queryCount += 500;
          rangefinderQueries += 100;
          break;
      }
      resolve(true);
    }, 2000);
  });
};

export const checkPurchaseStatus = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        isPurchased,
        subscriptionType,
        queryCount,
        rangefinderQueries
      });
    }, 1000);
  });
};

export const useQuery = async () => {
  if (queryCount > 0) {
    queryCount--;
    return true;
  }
  return false;
};

export const useRangefinderQuery = async () => {
  if (rangefinderQueries > 0) {
    rangefinderQueries--;
    return true;
  }
  return false;
};