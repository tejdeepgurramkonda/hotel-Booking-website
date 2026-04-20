package com.telusko.hotelservice.model;

public enum RoomType {
    DELUXE("Deluxe Sea View Suite"),
    HERITAGE("Heritage King Suite"),
    PENTHOUSE("Penthouse Residence");

    private final String displayName;

    RoomType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
