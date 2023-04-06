# Some setup

In order to have an easier time with the tutorial, we will create some utility functions to help us with the code.

## `guard` and `getError`

```typescript title="/services/api.ts"
//...
export const guard = async <T>(guardedInputs: unknown[], lambda: () => Promise<T>): Promise<{error: FetchBaseQueryError} | {data: T}> => {
  if (guardedInputs.some(x => !x)) {
    return {data: undefined};
  }
  try {
    const res = await lambda();
    const curate = (result: T): T => {
      return (
        result === null || result === undefined
          ? null
          : res instanceof ArrayBuffer
          ? ua2b64(res)
          : Array.isArray(result)
          ? result.map(curate)
          : typeof result === 'object'
          ? (result as any).marshal()
          : result
      ) as T;
    };
    return {data: curate(res)};
  } catch (e) {
    return {error: getError(e as Error)};
  }
};

function getError(e: Error): FetchBaseQueryError {
  return {status: 'CUSTOM_ERROR', error: e.message, data: undefined};
}
//...
```

`guard` is a function that takes an array of inputs and a lambda function. If any of the inputs are falsy, it returns `{data: undefined}`. Otherwise, it runs the lambda function and returns `{data: T}` if it succeeds, or `{error: FetchBaseQueryError}` if it fails.

## `getApiFromState`

```typescript title="/services/api.ts"
//...
export const getApiFromState = async (getState: () => MedTechApiState | {medTechApi: MedTechApiState} | undefined): Promise<MedTechApi | undefined> => {
  const state = getState();
  if (!state) {
    throw new Error('No state found');
  }
  const medTechApiState = 'medTechApi' in state ? state.medTechApi : state;
  const {user} = medTechApiState;

  if (!user) {
    return undefined;
  }

  const cachedApi = apiCache[`${user.groupId}/${user.id}`] as MedTechApi;

  return cachedApi;
};
//...
```

`getApiFromState` is a function that will return the `MedTechApi` instance from the state. It will return `undefined` if the user is not logged in.

## `currentUser`

```typescript title="/services/api.ts"
//...
export const currentUser = (getState: () => unknown) => {
    const state = getState() as {medTechApi: MedTechApiState};
    return state.medTechApi.user;
};
//...
```

`currentUser` is a function that will return the current user from the state.

## `medTechApi`

```typescript title="/services/api.ts"
//...
export const medTechApi = async (getState: () => unknown) => {
  const state = getState() as {medTechApi: MedTechApiState};
  return await getApiFromState(() => state);
};
//...
```

`medTechApi` is a function that will return the `MedTechApi` instance from the state.

## `tagsByIds` and `tagsByIdsPaginated`

Those two functions are used to transform the result of a query into a list of tags used by Redux. They are used the endpoints that we will create in the next chapter.

```typescript title="/utils/tags.ts"
export const tagsByIds =
  <TagType extends string>(tagType: TagType, listMarker?: string) =>
  (result: {id?: string}[] | undefined) => {
    const listMarkerTag = listMarker ? [{type: tagType, id: listMarker}] : [];
    return result ? result.map(({id}: {id?: string}) => ({type: tagType, id})).concat(listMarkerTag) : [];
  };

export const tagsByIdsPaginated =
  <TagType extends string>(tagType: TagType, listMarker?: string) =>
  (result: {rows?: {id?: string}[]}) =>
    tagsByIds(tagType, listMarker)(result?.rows ?? []);
```
