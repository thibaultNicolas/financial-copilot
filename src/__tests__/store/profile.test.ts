import { act, renderHook } from "@testing-library/react";
import { useProfileStore } from "@/store/profile";

// Reset store between tests
beforeEach(() => {
  act(() => {
    useProfileStore.getState().resetProfile();
  });
});

describe("useProfileStore", () => {
  it("starts with null profile", () => {
    const { result } = renderHook(() => useProfileStore());
    expect(result.current.profile).toBeNull();
  });

  it("starts on step 1", () => {
    const { result } = renderHook(() => useProfileStore());
    expect(result.current.currentStep).toBe(1);
  });

  it("updates profile correctly", () => {
    const { result } = renderHook(() => useProfileStore());
    act(() => {
      result.current.updateProfile({ firstName: "Nicolas", age: 30 });
    });
    expect(result.current.profile?.firstName).toBe("Nicolas");
    expect(result.current.profile?.age).toBe(30);
  });

  it("merges profile updates without overwriting", () => {
    const { result } = renderHook(() => useProfileStore());
    act(() => {
      result.current.updateProfile({ firstName: "Nicolas" });
      result.current.updateProfile({ age: 30 });
    });
    expect(result.current.profile?.firstName).toBe("Nicolas");
    expect(result.current.profile?.age).toBe(30);
  });

  it("advances step correctly", () => {
    const { result } = renderHook(() => useProfileStore());
    act(() => result.current.nextStep());
    expect(result.current.currentStep).toBe(2);
  });

  it("does not exceed total steps", () => {
    const { result } = renderHook(() => useProfileStore());
    act(() => {
      result.current.nextStep();
      result.current.nextStep();
      result.current.nextStep();
      result.current.nextStep();
      result.current.nextStep(); // Should cap at 4
    });
    expect(result.current.currentStep).toBe(4);
  });

  it("does not go below step 1", () => {
    const { result } = renderHook(() => useProfileStore());
    act(() => result.current.prevStep());
    expect(result.current.currentStep).toBe(1);
  });

  it("resets profile and step correctly", () => {
    const { result } = renderHook(() => useProfileStore());
    act(() => {
      result.current.updateProfile({ firstName: "Nicolas" });
      result.current.nextStep();
      result.current.resetProfile();
    });
    expect(result.current.profile).toBeNull();
    expect(result.current.currentStep).toBe(1);
  });
});
