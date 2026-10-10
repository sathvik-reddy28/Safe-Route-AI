// Haversine distance in metres
export const hv=(a,b)=>{const R=6371000,r=Math.PI/180,x=Math.sin((b[0]-a[0])*r/2)**2+Math.cos(a[0]*r)*Math.cos(b[0]*r)*Math.sin((b[1]-a[1])*r/2)**2;return 2*R*Math.asin(Math.sqrt(x))};
