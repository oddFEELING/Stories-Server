// ~ =============================================>
// ~ ======= Promise resolver  -->
// ~ =============================================>
export const promiseResolver = async <T>(
  promise: Promise<T>,
): Promise<{
  data: T | null;
  error: Error | null | unknown;
}> => {
  try {
    const data = await promise;
    return { data, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error };
  }
};
