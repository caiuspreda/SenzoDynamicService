using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.WindowsAzure.Storage.Table;

namespace SenzoDynamicService.Models
{
    public class SensorReadingEntry : TableEntity
    {
        public string DeviceId
        {
            get
            {
                return PartitionKey;
            }
        }

        public string SensorName
        {
            get
            {
                return RowKey;
            }
        }

        public string Value { get; set; }

        public long UtcTicks { get; set; }

        public SensorReadingEntry()
        {
            this.PartitionKey = DateTime.MaxValue.Subtract(DateTime.UtcNow).TotalMilliseconds.ToString();
        }

        public SensorReadingEntry(string deviceId, string sensorName)
        {
            //this.PartitionKey = deviceId;
            this.PartitionKey = DateTime.MaxValue.Subtract(DateTime.UtcNow).TotalMilliseconds.ToString();
            this.RowKey = sensorName;
        }
    }
}