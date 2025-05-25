import { PUBLIC_API_URL } from '$env/static/public';
export function load({ params }) {
  return {
    id: params.id
  };
}