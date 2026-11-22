export type SellerPlan = 'starter' | 'pro';

export function selectedSellerPlan(): SellerPlan | null {
  const plan = new URLSearchParams(window.location.search).get('plan');
  return plan === 'starter' || plan === 'pro' ? plan : null;
}

export function sellerLink(path: '/sign-in' | '/seller', plan?: SellerPlan | null) {
  return plan ? path + '?plan=' + plan : path;
}
