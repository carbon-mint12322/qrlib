function getAppName() {
  return process.env.NEXT_PUBLIC_APP_NAME || 'farmbook';
}

export default getAppName;
