export async function WaitInMilliseconds(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
}

export async function arraysOfObjectsAreEqual<T>(array1: T[], array2: T[]): Promise<boolean> {
    if (array1.length !== array2.length) {
      return false
    }
  
    const copyofArray1 = [...array1];
    const copyOfArray2 = [...array2];
  
    function objectsAreEqual<T>(object1: T, object2: T): boolean {
      for (const key in object1) {
        if (object1[key] !== object2[key]) {
          return false
        }
      }
      return true
    }
  
    for (let i = 0; i < copyofArray1.length; i++) {
      let foundMatch = false;
      for (let j = 0; j < copyOfArray2.length; j++) {
        if (objectsAreEqual(copyofArray1[i], copyOfArray2[j])) {
          copyOfArray2.splice(j, 1);
          foundMatch = true;
          break;
        }
      }
      if (!foundMatch) {
        return false;
      }
    }
  
    return true;
  }