using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.WindowsAzure.Storage.Table;

namespace SenzoDynamicService.Models
{
    public class SensorReading : TableEntity
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

        public SensorReading()
        {
        }

        public SensorReading(string deviceId, string sensorName)
        {
            this.PartitionKey = deviceId;
            this.RowKey = sensorName;
        }
    }
}